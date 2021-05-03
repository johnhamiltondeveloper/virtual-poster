CREATE TABLE `users` (
  `PersonID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `access_token` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PersonID`),
  UNIQUE KEY `PersonID_UNIQUE` (`PersonID`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `access_token_UNIQUE` (`access_token`)
)

