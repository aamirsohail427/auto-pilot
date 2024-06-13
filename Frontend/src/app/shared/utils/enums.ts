
export enum PageType {
  List,
  Trowser,
  Modal
}

export enum DateSelection {
  WeekToDate,
  LastWeek,
  MTD,
  LastMonth,
  CurrMonth,
  QTD,
  LastQTR,
  YearToDate,
  LastYear,
  CurrYear,
  ThirMonths,
  ThirWeeks,
  Custom
}


export enum PageTemplateTypes {
  Page = 'Page',
  Header = 'Header',
  Footer = 'Footer'
}

export enum authStatus {
  failed = 0,
  success = 1
}

export enum role {
  admin = 1,
  agency = 2,
  user = 3
}

export enum userRoles {
  admin = "admin",
  agency = "agency",
  user = "user"
}


export enum LoginType {
  Manual = 1,
  RememberMe = 2
}
