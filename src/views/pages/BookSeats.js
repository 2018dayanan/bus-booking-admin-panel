import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CAlert,
  CBadge,
} from '@coreui/react';

// Simple seat icon SVGs
const SeatIcon = ({ color = '#333', style = {} }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={style}>
    <rect x="6" y="10" width="20" height="12" rx="4" fill={color} stroke="#444" strokeWidth="2" />
    <rect x="8" y="22" width="16" height="4" rx="2" fill={color} stroke="#444" strokeWidth="2" />
  </svg>
);

const DriverIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="#2c3e50" stroke="#34495e" strokeWidth="2" />
    <text x="18" y="23" textAnchor="middle" fontSize="16" fill="white">🚍</text>
  </svg>
);

// Define seat layout with driver on the right side
const seatLayout = [
  ['', '', '', 'Driver'], // Driver moved to right side
  ['A', 'B', 'Ka', 'Kha'],
  ['C', 'D', 'GA', 'GHA'],
  ['A1', 'A2', 'B1', 'B2'],
  ['A3', 'A4', 'B3', 'B4'],
  ['A5', 'A6', 'B5', 'B6'],
  ['A7', 'A8', 'B7', 'B8'],
  ['A9', 'A10', 'B9', 'B10'],
  ['A11', 'A12', 'B11', 'B12'],
];

const OCCUPIED_SEATS = [2, 7, 12, 13, 15, 16, 18, 19, 21, 22, 24, 25, 27, 28, 30, 31]; // Based on gray seats in image
const SEAT_PRICE = 1200;

const BookSeats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getSeatState = (row, col) => {
    const seatIndex = row * 4 + col;
    if (OCCUPIED_SEATS.includes(seatIndex)) return 2;
    if (selectedSeats.includes(seatIndex)) return 1;
    return 0;
  };

  const handleSeatClick = (row, col) => {
    const seatIndex = row * 4 + col;
    const seatLabel = seatLayout[row][col];
    
    if (OCCUPIED_SEATS.includes(seatIndex) || seatLabel === 'Driver' || seatLabel === '') return;
    
    setSelectedSeats((prev) =>
      prev.includes(seatIndex)
        ? prev.filter((s) => s !== seatIndex)
        : [...prev, seatIndex]
    );
    setError(null);
  };

  const getTotalPrice = () => selectedSeats.length * SEAT_PRICE;

  const getSelectedSeatLabels = () => {
    return selectedSeats.map(seatIndex => {
      const row = Math.floor(seatIndex / 4);
      const col = seatIndex % 4;
      return seatLayout[row][col];
    }).filter(label => label && label !== 'Driver' && label !== '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      setSuccess(null);
      return;
    }
    setError(null);
    const seatLabels = getSelectedSeatLabels();
    setSuccess(`Seats booked successfully: ${seatLabels.join(', ')} | Total: NPR ${getTotalPrice()}`);
  };

  const renderSeats = () => {
    return seatLayout.map((row, rowIndex) => (
      <div key={`row-${rowIndex}`} style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '8px 0',
        gap: '8px'
      }}>
        {row.map((label, colIndex) => {
          const seatIndex = rowIndex * 4 + colIndex;
          const isOccupied = OCCUPIED_SEATS.includes(seatIndex);
          const isSelected = selectedSeats.includes(seatIndex);
          const isEmpty = label === '';
          
          if (isEmpty) {
            return <div key={`${rowIndex}-${colIndex}`} style={{ width: 48, height: 48 }} />;
          }
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleSeatClick(rowIndex, colIndex)}
              title={label === 'Driver' ? 'Driver Seat' : `Seat ${label} - NPR ${SEAT_PRICE}`}
              style={{
                position: 'relative',
                cursor: isOccupied || label === 'Driver' ? 'not-allowed' : 'pointer',
                opacity: isOccupied ? 0.6 : 1,
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                filter: isSelected ? 'drop-shadow(0 0 8px rgba(220, 53, 69, 0.5))' : 'none',
              }}
            >
              {label === 'Driver' ? (
                <div style={{ textAlign: 'center' }}>
                  <DriverIcon />
                  <div style={{ fontSize: '10px', color: '#2c3e50', fontWeight: 'bold', marginTop: '2px' }}>
                    DRIVER
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <SeatIcon
                    color={
                      isSelected ? '#e74c3c' // Selected - bright red
                      : isOccupied ? '#95a5a6' // Occupied - gray
                      : '#27ae60' // Available - green
                    }
                    style={{
                      filter: isSelected ? 'drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3))' : 'none'
                    }}
                  />
                  <div style={{ 
                    fontSize: '11px', 
                    color: isSelected ? '#e74c3c' : '#2c3e50', 
                    fontWeight: isSelected ? 'bold' : 'normal',
                    marginTop: '2px'
                  }}>
                    {label}
                  </div>
                  {isSelected && (
                    <CBadge 
                      color="danger" 
                      style={{ 
                        position: 'absolute', 
                        top: '-5px', 
                        right: '-5px', 
                        fontSize: '8px',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✓
                    </CBadge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <CRow className="justify-content-center mt-4">
      <CCol xs={12} md={10} lg={8}>
        <CCard className="shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <CCardHeader 
            className="text-center border-0" 
            style={{ 
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', 
              color: 'white',
              padding: '20px'
            }}
          >
            <h4 className="mb-1" style={{ fontWeight: '600' }}>🚌 BusSewa - FIFA Deluxe</h4>
            <small style={{ opacity: 0.9 }}>📅 2025-04-25 | 🕐 04:00 PM</small>
          </CCardHeader>
          <CCardBody style={{ padding: '25px' }}>
            {/* Price Summary */}
            {selectedSeats.length > 0 && (
              <CAlert 
                color="info" 
                className="mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Selected Seats:</strong> {getSelectedSeatLabels().join(', ')}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    NPR {getTotalPrice().toLocaleString()}
                  </div>
                </div>
                <small style={{ opacity: 0.8 }}>
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} × NPR {SEAT_PRICE.toLocaleString()} each
                </small>
              </CAlert>
            )}

            {/* Seat Legend */}
            <div className="mb-4 text-center">
              <h6 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Seat Legend</h6>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <SeatIcon color="#27ae60" /> <span style={{ fontSize: '14px' }}>Available</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <SeatIcon color="#e74c3c" /> <span style={{ fontSize: '14px' }}>Selected</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <SeatIcon color="#95a5a6" /> <span style={{ fontSize: '14px' }}>Booked</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="p-4 mb-4 rounded-3"
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: '2px solid #dee2e6',
                  borderRadius: '15px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <small style={{ color: '#6c757d', fontWeight: '500' }}>🚍 FRONT OF BUS</small>
                </div>
                {renderSeats()}
               
              </div>

              {error && (
                <CAlert color="danger" className="mb-3" style={{ borderRadius: '10px' }}>
                  <strong>⚠️ {error}</strong>
                </CAlert>
              )}
              {success && (
                <CAlert color="success" className="mb-3" style={{ borderRadius: '10px' }}>
                  <strong>✅ {success}</strong>
                </CAlert>
              )}

              <CButton 
                type="submit" 
                className="w-100"
                style={{
                  background: selectedSeats.length > 0 
                    ? 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' 
                    : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                disabled={selectedSeats.length === 0}
              >
                {selectedSeats.length > 0 
                  ? `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''} - NPR ${getTotalPrice().toLocaleString()}`
                  : 'Select Seats to Book'
                }
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BookSeats;