/**
 * Custom Error Page
 * Prevents Next.js from generating default error pages that conflict with app router
 */
function Error({ statusCode }: { statusCode?: number }) {
  return null;
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
