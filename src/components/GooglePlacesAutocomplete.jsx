import React, { useEffect, useRef, useState } from 'react'

export default function GooglePlacesAutocomplete({ value, onSelectPlace, error }) {
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [input, setInput] = useState(value?.formatted_address || '')
  const [predictions, setPredictions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const autocompleteRef = useRef(null)
  const placesServiceRef = useRef(null)

  // Initialize Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.onload = () => {
        initializeAutocomplete()
      }
      document.head.appendChild(script)
    } else {
      initializeAutocomplete()
    }
  }, [])

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return

    autocompleteRef.current = new window.google.maps.places.AutocompleteService()
    placesServiceRef.current = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )
  }

  // Handle input changes
  const handleInputChange = async (e) => {
    const val = e.target.value
    setInput(val)

    if (val.length < 3) {
      setPredictions([])
      setShowDropdown(false)
      return
    }

    if (!autocompleteRef.current) return

    setLoading(true)
    try {
      const response = await autocompleteRef.current.getPlacePredictions({
        input: val,
        componentRestrictions: { country: 'us' },
        types: ['address'],
      })

      setPredictions(response.predictions || [])
      setShowDropdown(true)
    } catch (err) {
      console.error('Autocomplete error:', err)
      setPredictions([])
    } finally {
      setLoading(false)
    }
  }

  // Handle prediction selection
  const handleSelectPrediction = async (prediction) => {
    setInput(prediction.description)
    setShowDropdown(false)
    setPredictions([])

    if (!placesServiceRef.current) return

    try {
      placesServiceRef.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['formatted_address', 'geometry', 'address_components'],
        },
        (placeDetails, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const { geometry, address_components, formatted_address } = placeDetails

            // Parse address components
            let street = '', city = '', state = '', zip = ''
            address_components.forEach(comp => {
              const types = comp.types
              if (types.includes('street_number') || types.includes('route')) {
                street += comp.long_name + ' '
              }
              if (types.includes('street_number') || types.includes('route')) {
                if (!street.includes(comp.long_name)) {
                  street += comp.long_name
                }
              }
              if (types.includes('locality')) city = comp.long_name
              if (types.includes('administrative_area_level_1')) state = comp.short_name
              if (types.includes('postal_code')) zip = comp.long_name
            })

            street = street.trim()

            onSelectPlace({
              formatted_address,
              street,
              city,
              state,
              zip,
              lat: geometry.location.lat(),
              lng: geometry.location.lng(),
            })
          }
        }
      )
    } catch (err) {
      console.error('Place details error:', err)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="google-places-wrapper" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        className={`mp-field__input${error ? ' mp-field__input--error' : ''}`}
        placeholder="Start typing your address…"
        value={input}
        onChange={handleInputChange}
        onFocus={() => input.length >= 3 && predictions.length > 0 && setShowDropdown(true)}
      />

      {loading && (
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <div className="mp-spinner" style={{ width: '16px', height: '16px' }} />
        </div>
      )}

      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="google-places-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px',
                border: 'none',
                background: 'white',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                fontSize: '14px',
                color: '#1a1641',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.target.style.background = 'white')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0, color: '#94a3b8' }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: 600 }}>
                    {prediction.main_text}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                    {prediction.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && input.length >= 3 && predictions.length === 0 && showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '12px',
            zIndex: 1000,
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          No addresses found
        </div>
      )}
    </div>
  )
}
