Cancel api
PUT -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings/{booking-id}/cancel
----------
Response:
{
    "message":"Booking cancelled successfully",
    "status":"CANCELLED"
}

---------------------------------------------
Booking API
POST -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings
Payload:
{
    "propertyId":1322,
    "checkIn":"2026-06-04",
    "checkOut":"2026-06-08",
    "numGuests":1
}
------------
Response:
{
    "id": 612,
    "tenant_id": 7,
    "property_id": 1322,
    "guest_id": 3052,
    "check_in": "2026-06-04",
    "check_out": "2026-06-08",
    "num_guests": 1,
    "total_price": 400,
    "status": "PENDING",
    "created_at": "2026-06-03T11:18:35.367Z",
    "updated_at": "2026-06-03T11:18:35.367Z",
    "property_title": "Beautiful Apartment in Budapest",
    "property_city": "Budapest",
    "property_country": "Hungary"
}


---------------------------------------------
getUpcomingBookings

GET -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings?status=PENDING
query string parameters (status=PENDING

Response:
{
    "bookings": [
        {
            "id": 562,
            "tenant_id": 7,
            "property_id": 1311,
            "guest_id": 3052,
            "check_in": "2026-05-11",
            "check_out": "2026-05-15",
            "num_guests": 1,
            "total_price": 640,
            "status": "PENDING",
            "created_at": "2026-05-08T14:37:18.964Z",
            "updated_at": "2026-05-08T14:37:18.964Z",
            "property_title": "Historic Apartment near Colosseum",
            "property_city": "Rome",
            "property_country": "Italy",
            "price_per_night": 160,
            "property_image": "https://picsum.photos/seed/prop15-img1/800/600",
            "host_id": 3040,
            "host_first_name": "Mike",
            "host_last_name": "Taylor",
            "host_avatar": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
    }
}


---------------------------------------------
getConfirmedBookings

GET -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings?status=CONFIRMED


// empty cuz nothing there
{"bookings":[],"pagination":{"page":1,"limit":20,"total":0,"totalPages":0}}
---------------------------------------------
getCancelledBookings
GET -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings?status=CANCELLED


---------------------------------------------
There is also declined endpoint. But, iam not sure what/when to use it yet.
https://qa-playground.nixdev.co/api/t/automation-abdelbary/bookings?status=DECLINED




-------------------------------------------------------------------------------------------------
HOST CONFIRM A BOOKING
PUT -> https://qa-playground.nixdev.co/api/t/automation-abdelbary/hosting/bookings/635/confirm
{"message":"Booking confirmed successfully","status":"CONFIRMED"}
