# Psikotest API Documentation

This document describes the API endpoints available for managing tokens and participants.

## Base URL
All API endpoints are relative to the `/api` route.
Example: `http://localhost:8000/api`

## Authentication
All API endpoints are protected and require a custom API Token to be provided in the request headers. You can provide the token in one of two ways:

1. **Bearer Token**: 
   `Authorization: Bearer <your_api_token>`
2. **Custom Header**:
   `X-API-TOKEN: <your_api_token>`

The expected token value must match the `API_TOKEN` defined in the `.env` file.

---

## 1. Token Management

### 1.1. List All Tokens
Retrieves a list of all generated tokens.

- **URL:** `/tokens`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "token": "a1B2c3D4e5",
          "test_type": "kraepelin,papi",
          "status": "unused",
          "intended_for_name": "John Doe",
          "intended_for_email": "john@example.com",
          "used_by": null,
          "used_at": null,
          "expires_at": "2026-08-10T12:00:00.000000Z",
          "created_at": "2026-08-05T06:00:00.000000Z",
          "updated_at": "2026-08-05T06:00:00.000000Z"
        }
      ]
    }
    ```

### 1.2. Create Tokens
Generates one or more new tokens.

- **URL:** `/tokens`
- **Method:** `POST`
- **Data Params:**
  - `test_type` (array, required): Types of tests allowed (`papi`, `kraepelin`). Example: `["papi", "kraepelin"]`
  - `quantity` (integer, required): Number of tokens to generate. Min 1, Max 100.
  - `intended_for_name` (string, optional): Name of the intended user.
  - `intended_for_email` (string, optional): Email of the intended user.
  - `expires_at` (string, required): Expiration date (e.g., `2026-08-10 23:59:00`).
- **Success Response:**
  - **Code:** 201 Created
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "1 token(s) created.",
      "data": [
        {
          "token": "XyZ987AbCd",
          "test_type": "kraepelin,papi",
          "status": "unused",
          "intended_for_name": "Jane Doe",
          "intended_for_email": "jane@example.com",
          "expires_at": "2026-08-10T16:59:00.000000Z",
          "updated_at": "2026-08-05T06:30:00.000000Z",
          "created_at": "2026-08-05T06:30:00.000000Z",
          "id": 2
        }
      ]
    }
    ```

### 1.3. Delete a Token
Deletes a specific token.

- **URL:** `/tokens/{token_id}`
- **Method:** `DELETE`
- **URL Params:**
  - `token_id` (integer, required): The ID of the token to delete.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Token deleted successfully."
    }
    ```

---

## 2. Participant Management

### 2.1. List All Participants
Retrieves a list of all participants, including their tokens and tests.

- **URL:** `/participants`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "age": 25,
          "position": "Developer",
          "institution": "Tech Corp",
          "token_id": 1,
          "created_at": "2026-08-05T07:00:00.000000Z",
          "updated_at": "2026-08-05T07:00:00.000000Z"
        }
      ]
    }
    ```

### 2.2. Show Participant Details
Retrieves details for a specific participant, including related tests and the token used.

- **URL:** `/participants/{participant_id}`
- **Method:** `GET`
- **URL Params:**
  - `participant_id` (integer, required): The ID of the participant.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "age": 25,
        "position": "Developer",
        "institution": "Tech Corp",
        "token_id": 1,
        "created_at": "2026-08-05T07:00:00.000000Z",
        "updated_at": "2026-08-05T07:00:00.000000Z",
        "token": {
          "id": 1,
          "token": "a1B2c3D4e5"
        },
        "participant_tests": [
          {
            "id": 1,
            "participant_id": 1,
            "test_type_id": 1,
            "status": "completed"
          }
        ]
      }
    }
    ```

### 2.3. Show Participant Results (Skor Sifat & Detail Jawaban)
Retrieves the detailed results of a participant's test, including trait scores (Skor Sifat), detailed PapiKostick answers (Detail Jawaban), and Kraepelin test data.

- **URL:** `/participants/{participant_id}/results`
- **Method:** `GET`
- **URL Params:**
  - `participant_id` (integer, required): The ID of the participant.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "data": {
        "participant": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "token_type": "kraepelin,papi"
        },
        "papi": {
          "traitScores": {
            "N": 5,
            "G": 3
          },
          "traitsDetails": {
            "N": {
              "name": "Menyelesaikan Tugas Pribadi",
              "description": "Mengukur dorongan..."
            }
          },
          "answers": [
            {
              "question_id": 1,
              "chosen_option": "A",
              "statement_a": "Saya seorang pekerja keras",
              "statement_b": "Saya bukan pemurung",
              "choice_a_trait": "G",
              "choice_b_trait": "S"
            }
          ]
        },
        "kraepelinData": {
          "chartData": [],
          "totalCorrect": 0,
          "hasData": false
        }
      }
    }
    ```

### 2.4. Delete a Participant
Deletes a specific participant.

- **URL:** `/participants/{participant_id}`
- **Method:** `DELETE`
- **URL Params:**
  - `participant_id` (integer, required): The ID of the participant to delete.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "status": "success",
      "message": "Participant deleted successfully."
    }
    ```
