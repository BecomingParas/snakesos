import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@/lib/apollo/hooks';
import type { AdminNotificationsData, NotificationStatus } from '../types';

export const ADMIN_NOTIFICATIONS_QUERY = gql`
  query AdminNotifications($pagination: PaginationInput, $filter: NotificationFilterInput) {
    myNotifications(pagination: $pagination, filter: $filter) {
      edges {
        node { id type title message read actionUrl link createdAt }
      }
      totalCount
      pageInfo { hasNextPage hasPreviousPage }
    }
  }
`;

const MARK_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) { id read }
  }
`;

const MARK_ALL_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead { success }
  }
`;

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) { success }
  }
`;

export function useAdminNotifications(page: number, pageSize: number, status: NotificationStatus) {
  const query = useQuery<AdminNotificationsData>(ADMIN_NOTIFICATIONS_QUERY, {
    variables: {
      pagination: { limit: pageSize, page },
      filter: status === 'all' ? undefined : { read: status === 'read' },
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
  });
  const [markRead, markReadState] = useMutation(MARK_READ_MUTATION);
  const [markAllRead, markAllReadState] = useMutation(MARK_ALL_READ_MUTATION);
  const [deleteNotification, deleteState] = useMutation(DELETE_NOTIFICATION_MUTATION);

  return {
    ...query,
    notifications: query.data?.myNotifications.edges || [],
    markReadState,
    markAllReadState,
    deleteState,
    markRead: (id: string) => markRead({ variables: { id }, refetchQueries: [ADMIN_NOTIFICATIONS_QUERY] }),
    markAllRead: () => markAllRead({ refetchQueries: [ADMIN_NOTIFICATIONS_QUERY] }),
    deleteNotification: (id: string) => deleteNotification({ variables: { id }, refetchQueries: [ADMIN_NOTIFICATIONS_QUERY] }),
  };
}
