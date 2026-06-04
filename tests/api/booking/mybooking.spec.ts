/*
Given I have a booking with status DECLINED, when I attempt to cancel it, then I receive a 400 error indicating the booking cannot be cancelled
Given I have a booking with status COMPLETED, when I attempt to cancel it, then I receive a 400 error indicating the booking cannot be cancelled
Given I have a booking with status CANCELLED, when I attempt to cancel it again, then I receive a 400 error indicating the booking is already cancelled
Given I am not the guest who made the booking, when I attempt to cancel it, then I receive a 403 error indicating I am not authorized
 */

