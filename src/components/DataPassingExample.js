import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader, CButton, CListGroup, CListGroupItem } from '@coreui/react';

/**
 * React Data Passing Methods (Similar to Flutter Constructor)
 * 
 * This component demonstrates different ways to pass data between screens in React,
 * similar to how you pass data through constructors in Flutter.
 */

const DataPassingExample = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Example data object (like your ticket data)
  const sampleTicketData = {
    _id: '12345',
    operatorName: 'John Doe',
    bussName: 'Express Bus',
    bussNo: 'BUS001',
    vehicleType: 'bus',
    departureTime: '08:00',
    arrivalTime: '16:00',
    date: '2024-01-15',
    from: 'New York',
    to: 'Los Angeles',
    price: 150.00,
    totalSeats: 50,
    totalTimeTaken: '8 hours',
    shift: 'day'
  };

  // Method 1: URL Parameters (Simple data)
  const navigateWithParams = () => {
    navigate(`/admin/tickets/edit/${sampleTicketData._id}`);
  };

  // Method 2: React Router State (Complex data - like Flutter constructor)
  const navigateWithState = () => {
    navigate(`/admin/tickets/edit/${sampleTicketData._id}`, {
      state: { 
        ticketData: sampleTicketData,
        source: 'ticket-list',
        timestamp: new Date().toISOString()
      }
    });
  };

  // Method 3: Query Parameters
  const navigateWithQuery = () => {
    const params = new URLSearchParams({
      operatorName: sampleTicketData.operatorName,
      bussName: sampleTicketData.bussName,
      vehicleType: sampleTicketData.vehicleType
    });
    navigate(`/admin/tickets/edit/${sampleTicketData._id}?${params.toString()}`);
  };

  // Method 4: Local Storage (Persistent data)
  const navigateWithLocalStorage = () => {
    localStorage.setItem('editTicketData', JSON.stringify(sampleTicketData));
    navigate(`/admin/tickets/edit/${sampleTicketData._id}`);
  };

  // Method 5: Context API (Global state)
  const navigateWithContext = () => {
    // This would require setting up React Context
    // For now, we'll use localStorage as a simple alternative
    sessionStorage.setItem('contextTicketData', JSON.stringify(sampleTicketData));
    navigate(`/admin/tickets/edit/${sampleTicketData._id}`);
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>React Data Passing Methods (Flutter Constructor Style)</h5>
      </CCardHeader>
      <CCardBody>
        <CListGroup>
          <CListGroupItem>
            <h6>Method 1: URL Parameters</h6>
            <p className="text-muted">Pass simple data through URL (ID only)</p>
            <CButton color="primary" size="sm" onClick={navigateWithParams}>
              Navigate with ID only
            </CButton>
          </CListGroupItem>

          <CListGroupItem>
            <h6>Method 2: React Router State (Recommended)</h6>
            <p className="text-muted">Pass complex data through navigation state (like Flutter constructor)</p>
            <CButton color="success" size="sm" onClick={navigateWithState}>
              Navigate with Full Data
            </CButton>
          </CListGroupItem>

          <CListGroupItem>
            <h6>Method 3: Query Parameters</h6>
            <p className="text-muted">Pass data through URL query string</p>
            <CButton color="info" size="sm" onClick={navigateWithQuery}>
              Navigate with Query Params
            </CButton>
          </CListGroupItem>

          <CListGroupItem>
            <h6>Method 4: Local Storage</h6>
            <p className="text-muted">Store data in browser's local storage</p>
            <CButton color="warning" size="sm" onClick={navigateWithLocalStorage}>
              Navigate with Local Storage
            </CButton>
          </CListGroupItem>

          <CListGroupItem>
            <h6>Method 5: Context API</h6>
            <p className="text-muted">Use React Context for global state management</p>
            <CButton color="secondary" size="sm" onClick={navigateWithContext}>
              Navigate with Context
            </CButton>
          </CListGroupItem>
        </CListGroup>

        {location.state && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6>Received Data from Navigation State:</h6>
            <pre className="mb-0">
              {JSON.stringify(location.state, null, 2)}
            </pre>
          </div>
        )}
      </CCardBody>
    </CCard>
  );
};

export default DataPassingExample; 