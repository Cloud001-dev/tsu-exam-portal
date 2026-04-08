CREATE TABLE `studentTimetables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`timetableId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studentTimetables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matricNumber` varchar(50) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`department` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`profilePhotoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_matricNumber_unique` UNIQUE(`matricNumber`)
);
--> statement-breakpoint
CREATE TABLE `timetableFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileUrl` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`uploadedByAdmin` varchar(255) NOT NULL,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timetableFiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timetables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`examId` varchar(100) NOT NULL,
	`courseCode` varchar(50) NOT NULL,
	`courseName` varchar(255) NOT NULL,
	`examDate` varchar(50) NOT NULL,
	`startTime` varchar(50) NOT NULL,
	`endTime` varchar(50) NOT NULL,
	`venue` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timetables_id` PRIMARY KEY(`id`),
	CONSTRAINT `timetables_examId_unique` UNIQUE(`examId`)
);
