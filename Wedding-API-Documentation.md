# Wedding Management API Documentation

## Overview

This API provides endpoints for managing wedding events, guest groups, and individual guests. The system organizes guests into groups for better tracking and invitation management.

## Database Schema

### Tables Structure

**Events Table**
- Contains wedding events information
- Referenced by groups via `event_id`

**Groups Table**
- `id` - Primary key
- `name` - Group name
- `total_invitations` - Total number of invitations for the group
- `confirmed_invitations` - Number of confirmed invitations
- `confirmed_status` - Boolean flag for confirmation status
- `opened_status` - Boolean flag indicating if invitation was opened
- `sent_status` - Boolean flag indicating if invitation was sent
- `deny_status` - Boolean flag indicating if invitation was denied
- `leader_id` - Foreign key referencing guest who leads the group
- `event_id` - Foreign key referencing the wedding event
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

**Guests Table**
- `id` - Primary key
- `name` - Guest name
- `email` - Guest email
- `phone_number` - Guest phone number
- `group_id` - Foreign key referencing the group (nullable for unassigned guests)
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

## API Endpoints

### Groups API

#### 1. Get All Groups
- **Endpoint**: `GET /api/groups`
- **Description**: Retrieves all groups ordered by name
- **Response**: Array of group objects

#### 2. Create Group
- **Endpoint**: `POST /api/groups`
- **Description**: Creates a new group
- **Request Body**:
  ```json
  {
    "group": {
      "name": "string",
      "total_invitations": "number"
    }
  }
  ```
- **Response**: Created group object

#### 3. Get Group by ID
- **Endpoint**: `GET /api/groups/[id]`
- **Description**: Retrieves a specific group with its guests
- **Response**: Group object with nested guests array

#### 4. Update Group
- **Endpoint**: `PUT /api/groups/[id]`
- **Description**: Updates group information
- **Request Body**:
  ```json
  {
    "group": {
      "name": "string",
      "total_invitations": "number",
      "confirmed_invitations": "number"
    }
  }
  ```

#### 5. Delete Group
- **Endpoint**: `DELETE /api/groups/[id]`
- **Description**: Deletes a specific group

#### 6. Get Groups with Guests
- **Endpoint**: `GET /api/groups/with-guests`
- **Description**: Retrieves all groups with their associated guests
- **Response**: Array of group objects with nested guests arrays

#### 7. Add Group Leader
- **Endpoint**: `POST /api/groups/add-group-leader`
- **Description**: Assigns a guest as group leader
- **Request Body**:
  ```json
  {
    "groupId": "number",
    "guestId": "number"
  }
  ```

#### 8. Add Guest to Group
- **Endpoint**: `POST /api/groups/add-guest-to-group`
- **Description**: Assigns a guest to a specific group
- **Request Body**:
  ```json
  {
    "groupId": "number",
    "guestId": "number"
  }
  ```

#### 9. Send Invitation
- **Endpoint**: `PUT /api/groups/send-invitation`
- **Description**: Marks invitation as sent
- **Request Body**:
  ```json
  {
    "id": "number"
  }
  ```

#### 10. Open Invitation
- **Endpoint**: `PUT /api/groups/open-invitation`
- **Description**: Marks invitation as opened
- **Request Body**:
  ```json
  {
    "id": "number"
  }
  ```

#### 11. Confirm Invitation
- **Endpoint**: `PUT /api/groups/confirm-invitation`
- **Description**: Confirms invitation with number of attendees
- **Request Body**:
  ```json
  {
    "id": "number",
    "confirmed_invitations": "number"
  }
  ```

#### 12. Deny Invitation
- **Endpoint**: `PUT /api/groups/deny-invitation`
- **Description**: Marks invitation as denied
- **Request Body**:
  ```json
  {
    "id": "number"
  }
  ```

#### 13. Export Groups
- **Endpoint**: `GET /api/groups/export`
- **Description**: Exports all groups data as CSV
- **Response**: CSV file download

### Guests API

#### 1. Get All Guests
- **Endpoint**: `GET /api/guests`
- **Description**: Retrieves all guests

#### 2. Add Guest
- **Endpoint**: `POST /api/guests`
- **Description**: Creates a new guest
- **Request Body**:
  ```json
  {
    "guest": {
      "name": "string",
      "email": "string",
      "phone": "string",
      "group_id": "number"
    }
  }
  ```

#### 3. Update Guest
- **Endpoint**: `PUT /api/guests`
- **Description**: Updates guest information
- **Request Body**:
  ```json
  {
    "guest": {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone_number": "string"
    }
  }
  ```

#### 4. Delete Guest
- **Endpoint**: `DELETE /api/guests`
- **Description**: Deletes a guest
- **Request Body**:
  ```json
  {
    "id": "number"
  }
  ```

#### 5. Get Guest by ID (with Group Info)
- **Endpoint**: `GET /api/guests/[id]`
- **Description**: Retrieves group information by guest ID
- **Note**: This endpoint actually returns group data, not individual guest data

#### 6. Delete Guest by ID
- **Endpoint**: `DELETE /api/guests/[id]`
- **Description**: Deletes a specific guest by ID

#### 7. Get Unassigned Guests
- **Endpoint**: `GET /api/guests/unassigned`
- **Description**: Retrieves all guests not assigned to any group

## Data Flow

1. **Event Creation**: Events are created in the events table
2. **Group Management**: Groups are created and associated with events
3. **Guest Management**: Guests are added and can be assigned to groups
4. **Invitation Workflow**:
   - Groups are created with total invitation count
   - Invitations are sent (sent_status = true)
   - Recipients open invitations (opened_status = true)
   - Recipients confirm or deny invitations
   - Confirmed invitations are tracked with count

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Usage Examples

### Creating a Group
```javascript
const response = await fetch('/api/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    group: {
      name: "Family Smith",
      total_invitations: 4
    }
  })
});
```

### Adding a Guest to a Group
```javascript
const response = await fetch('/api/groups/add-guest-to-group', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    groupId: 1,
    guestId: 5
  })
});
```

### Confirming an Invitation
```javascript
const response = await fetch('/api/groups/confirm-invitation', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 1,
    confirmed_invitations: 3
  })
});
```

## Notes

- All groups are created with default values for status flags (false) and event_id (1)
- Guests can exist without being assigned to a group (unassigned guests)
- The system tracks the complete invitation lifecycle from sending to confirmation/denial
- Group leaders can be assigned from existing guests in the group
- CSV export functionality allows for data backup and external processing 