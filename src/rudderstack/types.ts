export enum ERudderStackEvents {
  Login = 'Login',
  Signup = 'Signup', // done
  UserKYCSubmitted = 'UserKYCSubmitted', // done
  UserKYCStarted = 'UserKYCStarted', // done

  TicketViewed = 'TicketViewed', //done
  TicketOptionCreated = 'TicketOptionCreated', //done
  TicketOptionUpdated = 'TicketOptionUpdated', //done
  TicketOptionDeleted = 'TicketOptionDeleted', //done

  EventViewed = 'EventViewed', // done
  EventSearched = 'EventSearched', //done

  EventUpdated = 'EventUpdated', // done
  EventCreated = 'EventCreated', // done
  EventDeleted = 'EventDeleted', // done

  EventPublished = 'EventPublished', // done
  EventRepublished = 'EventRepublished', // done

  PromoCodeCreated = 'PromoCodeCreated', // done
  PromoCodeUpdated = 'PromoCodeUpdated', // done
  PromoCodeDeleted = 'PromoCodeDeleted', // done

  GiftCreated = 'GiftCreated', //done

  FanRequestedRefund = 'FanRequestedRefund', //done
  OrganizerRequestedRefund = 'OrganizerRequestedRefund', //done
  OrganizerApprovedRefund = 'OrganizerApprovedRefund', //done
  OrganizerDeniedRefund = 'OrganizerDeniedRefund', // done

  UserCheckedIn = 'UserCheckedIn', //done

  TeamCreated = 'TeamCreated', // done
  TeamAddedMember = 'TeamAddedMember', //done

  OrganizerPurchaseHistoryExported = 'OrganizerPurchaseHistoryExported', //done
  FanPurchaseHistoryExported = 'FanPurchaseHistoryExported', //done

  GiftHistoryExported = 'GiftHistoryExported', //done
  TeamExported = 'TeamExported', //done

  ProfileUpdated = 'ProfileUpdated', //done
  UserEmailUpdated = 'UserEmailUpdated', //done

  OrganizerViewedInsight = 'OrganizerViewedInsight', //done
  OrganizerSearchedEventAttendance = 'OrganizerSearchedEventAttendance', //done

  UserEnteredPromoCode = 'UserEnteredPromoCode', //done

  UserStartedPayTicket = 'UserStartedPayTicket', //done
  UserSubmittedPayCryptoTransaction = 'UserSubmittedPayCryptoTransaction', //done
  UserSubmittedPayFiatTransaction = 'UserSubmittedPayFiatTransaction', //done
}
