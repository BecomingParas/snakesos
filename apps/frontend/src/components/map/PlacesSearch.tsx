'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PlacesSearchResult {
  placeId: string;
  description: string;
  latitude?: number;
  longitude?: number;
  mainText: string;
  secondaryText?: string;
}

export interface PlacesSearchProps {
  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Called when user selects a place
   */
  onPlaceSelected: (place: PlacesSearchResult) => void;

  /**
   * Custom debounce delay in ms
   */
  debounceMs?: number;

  /**
   * Container class name
   */
  className?: string;

  /**
   * Input class name
   */
  inputClassName?: string;

  /**
   * Restrict results to a country (ISO 2-letter code, e.g., 'NP' for Nepal)
   */
  countryCode?: string;

  /**
   * Location bounds to bias results (Nepal by default)
   */
  locationBias?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  /**
   * Value to display in input
   */
  value?: string;

  /**
   * When value changes
   */
  onValueChange?: (value: string) => void;
}

// Nepal bounds to bias location search
const NEPAL_BOUNDS = {
  north: 30.4,
  south: 26.3,
  east: 88.2,
  west: 80.0,
};

/**
 * PlacesSearch Component
 *
 * Google Places autocomplete search with Nepal default bounds
 * 
 * Usage:
 * ```tsx
 * <PlacesSearch
 *   placeholder="Search for an address..."
 *   onPlaceSelected={(place) => {
 *     console.log(place.latitude, place.longitude);
 *   }}
 *   countryCode="NP"
 * />
 * ```
 */
export function PlacesSearch({
  placeholder = 'Search address or landmark...',
  onPlaceSelected,
  debounceMs = 300,
  className = '',
  inputClassName = '',
  countryCode = 'NP',
  locationBias = NEPAL_BOUNDS,
  value: controlledValue,
  onValueChange,
}: PlacesSearchProps) {
  const [inputValue, setInputValue] = useState(controlledValue || '');
  const [suggestions, setSuggestions] = useState<PlacesSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google?.maps?.places) {
      return;
    }

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }

    if (!placesServiceRef.current) {
      const div = document.createElement('div');
      placesServiceRef.current = new google.maps.places.PlacesService(div);
    }
  }, []);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Get place details including coordinates
   */
  const getPlaceDetails = useCallback(
    (placeId: string, description: string, mainText: string, secondaryText?: string) => {
      if (!placesServiceRef.current || !placeId) return;

      placesServiceRef.current.getDetails(
        {
          placeId,
          fields: ['geometry', 'formatted_address'],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            onPlaceSelected({
              placeId,
              description,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              mainText,
              secondaryText,
            });
            setInputValue(description);
            setIsOpen(false);
            setSuggestions([]);
          }
        }
      );
    },
    [onPlaceSelected]
  );

  /**
   * Search for places based on input
   */
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await autocompleteServiceRef.current.getPlacePredictions({
        input: query,
        locationBias: locationBias as unknown as google.maps.places.LocationBias,
        componentRestrictions: countryCode ? { country: countryCode.toLowerCase() } : undefined,
      });

      if (result.predictions) {
        setSuggestions(
          result.predictions.map((prediction) => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting?.main_text || prediction.description,
            secondaryText: prediction.structured_formatting?.secondary_text,
          }))
        );
        setIsOpen(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Places search error:', err);
      setError('Failed to search places');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
      setSelectedIndex(-1);
    }
  }, [countryCode, locationBias]);

  /**
   * Handle input change with debounce
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onValueChange?.(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        handleSearch(value);
      }, debounceMs);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          getPlaceDetails(
            suggestion.placeId,
            suggestion.description,
            suggestion.mainText,
            suggestion.secondaryText
          );
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: PlacesSearchResult) => {
    getPlaceDetails(
      suggestion.placeId,
      suggestion.description,
      suggestion.mainText,
      suggestion.secondaryText
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setSuggestions.length > 0 && setIsOpen(true)}
          className={cn('pl-10', inputClassName)}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-75 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0',
                selectedIndex === index && 'bg-muted'
              )}
            >
              <div className="font-medium text-sm text-foreground">
                {suggestion.mainText}
              </div>
              {suggestion.secondaryText && (
                <div className="text-xs text-muted-foreground mt-1">
                  {suggestion.secondaryText}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isLoading && inputValue.trim() && suggestions.length === 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No places found
        </div>
      )}
    </div>
  );
}

export default PlacesSearch;
