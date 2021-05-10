CREATE TABLE `animation` (
  `frameID` int NOT NULL AUTO_INCREMENT,
  `AnimationID` int DEFAULT NULL,
  `locationX` int DEFAULT NULL,
  `locationY` int DEFAULT NULL,
  `scale` int DEFAULT NULL,
  `time` int DEFAULT NULL,
  PRIMARY KEY (`frameID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `attendees` (
  `UserID` int NOT NULL,
  `EventID` int NOT NULL,
  PRIMARY KEY (`UserID`,`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `event` (
  `EventID` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `EventOwner` int DEFAULT NULL,
  PRIMARY KEY (`EventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `presentation` (
  `PresentationID` int NOT NULL,
  `video` varchar(100) DEFAULT NULL,
  `pdf` varchar(100) DEFAULT NULL,
  `AnimationID` int DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PresentationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `presentationowner` (
  `OwnerID` int NOT NULL AUTO_INCREMENT,
  `EventID` int DEFAULT NULL,
  `UserID` int DEFAULT NULL,
  `PresentationID` int DEFAULT NULL,
  PRIMARY KEY (`OwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `access_token` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `user_level` int DEFAULT '0',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `PersonID_UNIQUE` (`UserID`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `access_token_UNIQUE` (`access_token`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
