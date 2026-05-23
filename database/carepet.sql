-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: carepet
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `breeds`
--

DROP TABLE IF EXISTS `breeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breeds` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `species` enum('dog','cat') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_breed_species` (`name`,`species`),
  KEY `idx_species` (`species`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breeds`
--

LOCK TABLES `breeds` WRITE;
/*!40000 ALTER TABLE `breeds` DISABLE KEYS */;
INSERT INTO `breeds` VALUES (85,'Abisinio','cat'),(2,'Afgano','dog'),(3,'Akita Inu','dog'),(4,'Alano Espanol','dog'),(83,'Angora Turco','cat'),(80,'Azul Ruso','cat'),(5,'Basenji','dog'),(6,'Basset Grifon vandeano','dog'),(7,'Basset Hound','dog'),(8,'Beagle','dog'),(9,'Beauceron','dog'),(10,'Bedlington Terrier','dog'),(79,'Bengali','cat'),(11,'Bergamasco','dog'),(12,'Bichon frise','dog'),(13,'Bichon Maltes','dog'),(14,'Bloodhound','dog'),(15,'Bobtail','dog'),(16,'Border Collie','dog'),(17,'Border Terrier','dog'),(18,'Borzoi','dog'),(84,'Bosque de Noruega','cat'),(19,'Boston Terrier','dog'),(20,'Boxer','dog'),(21,'Boyero de Berna','dog'),(22,'Boyero de Flandes','dog'),(23,'Bracco Italiano','dog'),(24,'Braco aleman','dog'),(25,'Braco de Weimar','dog'),(26,'Braco Hungaro','dog'),(27,'Breton','dog'),(81,'Britanico de Pelo Corto','cat'),(28,'Buhund noruego','dog'),(29,'Bull Terrier','dog'),(30,'Bulldog Frances','dog'),(31,'Bulldog Ingles','dog'),(32,'Bullmastiff','dog'),(33,'Ca de Bestiar','dog'),(34,'Ca de Bou','dog'),(35,'Ca Me Mallorqui','dog'),(36,'Ca Rater Mallorqui','dog'),(37,'Cairn Terrier','dog'),(38,'Can de Palleiro','dog'),(39,'Can Guicho','dog'),(40,'Caniche','dog'),(41,'Caniche Toy','dog'),(42,'Carlino','dog'),(43,'Cavalier King Charles Spaniel','dog'),(44,'Cazador de alces noruego','dog'),(45,'Chihuahua','dog'),(46,'Chin japones','dog'),(47,'Chow chow','dog'),(48,'Clumber Spaniel','dog'),(49,'Cobrador de Nueva Escocia','dog'),(50,'Cockapoo','dog'),(51,'Cocker Spaniel americano','dog'),(52,'Cocker Spaniel ingles','dog'),(53,'Collie','dog'),(54,'Corgie','dog'),(57,'Dachshund','dog'),(55,'Dalmata','dog'),(56,'Doberman','dog'),(82,'Esfinge','cat'),(86,'Europeo Comun','cat'),(58,'Golden Retriever','dog'),(59,'Gran Danes','dog'),(60,'Husky Siberiano','dog'),(61,'Jack Russell Terrier','dog'),(62,'Labrador Retriever','dog'),(77,'Maine Coon','cat'),(63,'Mestizo','dog'),(87,'Mestizo','cat'),(74,'Otro','dog'),(88,'Otro','cat'),(64,'Pastor Aleman','dog'),(75,'Persa','cat'),(66,'Pomerania','dog'),(65,'Poodle','dog'),(78,'Ragdoll','cat'),(67,'Rottweiler','dog'),(70,'San Bernardo','dog'),(69,'Schnauzer','dog'),(71,'Shiba Inu','dog'),(68,'Shih Tzu','dog'),(76,'Siames','cat'),(72,'Xoloitzcuintle','dog'),(73,'Yorkshire Terrier','dog');
/*!40000 ALTER TABLE `breeds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `household_invitations`
--

DROP TABLE IF EXISTS `household_invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `household_invitations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `household_id` bigint NOT NULL,
  `invited_by_user_id` bigint NOT NULL,
  `invited_user_email` varchar(255) NOT NULL,
  `role_offered` varchar(20) NOT NULL,
  `message` text,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invited_by_user_id` (`invited_by_user_id`),
  KEY `idx_invited_email` (`invited_user_email`),
  KEY `idx_household` (`household_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `household_invitations_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  CONSTRAINT `household_invitations_ibfk_2` FOREIGN KEY (`invited_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `household_invitations`
--

LOCK TABLES `household_invitations` WRITE;
/*!40000 ALTER TABLE `household_invitations` DISABLE KEYS */;
INSERT INTO `household_invitations` VALUES (3,9,8,'marialopez@email.com','MEMBER','Únete para cuidar a Thor','ACCEPTED','2026-04-14 09:29:50','2026-04-14 09:32:16',NULL),(4,9,7,'pedro@mail.com','MEMBER','Únete a nosotros','PENDING','2026-04-15 06:45:21',NULL,NULL),(5,11,10,'lucia@gmail.com','MEMBER','Bienvenida a mi hogar!!!','ACCEPTED','2026-05-13 07:09:29','2026-05-13 07:10:07',NULL),(6,13,10,'lucia@gmail.com','MEMBER',NULL,'REJECTED','2026-05-13 07:26:49',NULL,'2026-05-13 07:27:56'),(7,14,11,'ainhoa@gmail.com','MEMBER','Bienvenida a mi casa del pueblo en la que cuidaremos del gato de mis padres','ACCEPTED','2026-05-14 06:37:24','2026-05-14 06:37:45',NULL),(8,15,11,'ainhoa@gmail.com','MEMBER',NULL,'REJECTED','2026-05-21 06:16:43',NULL,'2026-05-21 06:23:50');
/*!40000 ALTER TABLE `household_invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `household_members`
--

DROP TABLE IF EXISTS `household_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `household_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `household_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role` varchar(20) NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_household_user` (`household_id`,`user_id`),
  KEY `idx_household` (`household_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `household_members_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  CONSTRAINT `household_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `household_members`
--

LOCK TABLES `household_members` WRITE;
/*!40000 ALTER TABLE `household_members` DISABLE KEYS */;
INSERT INTO `household_members` VALUES (11,9,8,'OWNER','2026-04-14 09:10:04'),(12,9,7,'ADMIN','2026-04-14 09:32:16'),(13,10,9,'OWNER','2026-04-15 08:03:22'),(14,11,10,'OWNER','2026-05-08 15:45:24'),(16,11,11,'MEMBER','2026-05-13 07:10:07'),(17,13,10,'OWNER','2026-05-13 07:25:14'),(18,14,11,'OWNER','2026-05-14 06:34:57'),(19,14,10,'MEMBER','2026-05-14 06:37:45'),(20,15,11,'OWNER','2026-05-21 06:16:22');
/*!40000 ALTER TABLE `household_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `households`
--

DROP TABLE IF EXISTS `households`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `households` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `invite_code` varchar(50) DEFAULT NULL,
  `created_by_user_id` bigint NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invite_code` (`invite_code`),
  KEY `created_by` (`created_by_user_id`),
  KEY `idx_invite_code` (`invite_code`),
  CONSTRAINT `households_ibfk_1` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `households`
--

LOCK TABLES `households` WRITE;
/*!40000 ALTER TABLE `households` DISABLE KEYS */;
INSERT INTO `households` VALUES (6,'Familia Rodríguez',NULL,5,NULL,'2026-03-12 18:38:11',NULL),(9,'Casa de Ana',NULL,8,'Hogar para Thor','2026-04-14 09:10:04','2026-04-14 09:10:04'),(10,'Casa de Laura',NULL,9,'Mi primer hogar','2026-04-15 08:03:22','2026-04-15 08:03:22'),(11,'Mi Pisito',NULL,10,'Residencia principal','2026-05-08 15:44:39','2026-05-09 08:01:08'),(13,'Casa de la playa',NULL,10,NULL,'2026-05-13 07:25:14','2026-05-13 07:25:14'),(14,'Casa Pueblo',NULL,11,'Casa de mis padres en el pueblo','2026-05-14 06:34:57','2026-05-14 06:34:57'),(15,'Casa Playa',NULL,11,NULL,'2026-05-21 06:16:22','2026-05-21 06:16:22');
/*!40000 ALTER TABLE `households` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_logs`
--

DROP TABLE IF EXISTS `meal_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `meal_id` bigint NOT NULL,
  `given_by_user_id` bigint DEFAULT NULL,
  `given_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_meal` (`meal_id`),
  KEY `idx_user` (`given_by_user_id`),
  KEY `idx_given_at` (`given_at`),
  KEY `idx_meal_date` (`meal_id`,`given_at`),
  CONSTRAINT `meal_logs_ibfk_1` FOREIGN KEY (`meal_id`) REFERENCES `meals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meal_logs_ibfk_2` FOREIGN KEY (`given_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_logs`
--

LOCK TABLES `meal_logs` WRITE;
/*!40000 ALTER TABLE `meal_logs` DISABLE KEYS */;
INSERT INTO `meal_logs` VALUES (3,3,NULL,'2026-04-08 08:56:52','Primera comida del día','2026-04-08 08:56:52'),(4,3,NULL,'2026-04-08 08:57:14','Segunda comida','2026-04-08 08:57:14'),(5,4,NULL,'2026-04-14 10:00:00','Le di de comer - María','2026-04-15 06:34:25'),(7,6,10,'2026-05-21 06:43:53','Comió todo','2026-05-21 06:43:53');
/*!40000 ALTER TABLE `meal_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meals`
--

DROP TABLE IF EXISTS `meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint NOT NULL,
  `meals_per_day` int NOT NULL DEFAULT '2',
  `first_meal_time` time NOT NULL,
  `second_meal_time` time DEFAULT NULL,
  `third_meal_time` time DEFAULT NULL,
  `fourth_meal_time` time DEFAULT NULL,
  `notes` text,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pet` (`pet_id`),
  KEY `idx_active` (`active`),
  CONSTRAINT `meals_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meals`
--

LOCK TABLES `meals` WRITE;
/*!40000 ALTER TABLE `meals` DISABLE KEYS */;
INSERT INTO `meals` VALUES (2,7,3,'08:00:00','14:00:00','21:00:00',NULL,NULL,1,'2026-03-12 18:45:33','2026-03-12 18:45:33'),(3,11,2,'08:00:00','20:00:00',NULL,NULL,'Pienso seco',1,'2026-04-08 08:54:13','2026-04-08 08:54:13'),(4,13,2,'08:00:00','20:00:00',NULL,NULL,'Darle agua fresca',1,'2026-04-14 09:24:34','2026-04-14 09:24:34'),(6,14,1,'14:00:00',NULL,NULL,NULL,NULL,1,'2026-05-21 06:42:49','2026-05-21 06:42:49');
/*!40000 ALTER TABLE `meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medication_logs`
--

DROP TABLE IF EXISTS `medication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `medication_id` bigint NOT NULL,
  `given_by_user_id` bigint DEFAULT NULL,
  `given_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_medication` (`medication_id`),
  KEY `idx_user` (`given_by_user_id`),
  KEY `idx_given_at` (`given_at`),
  KEY `idx_medication_date` (`medication_id`,`given_at`),
  CONSTRAINT `medication_logs_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `medication_logs_ibfk_2` FOREIGN KEY (`given_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medication_logs`
--

LOCK TABLES `medication_logs` WRITE;
/*!40000 ALTER TABLE `medication_logs` DISABLE KEYS */;
INSERT INTO `medication_logs` VALUES (2,5,NULL,'2026-03-29 11:04:13','Administrado a las 9:15 AM - Sin problemas','2026-03-29 11:04:13'),(3,5,NULL,'2026-03-29 11:06:01','Segunda administración a las 21:00','2026-03-29 11:06:01'),(4,6,NULL,'2026-03-29 11:07:46','Primera toma de vitamina','2026-03-29 11:07:46'),(5,8,NULL,'2026-05-13 09:41:04',NULL,'2026-05-13 09:41:04'),(10,10,10,'2026-05-14 07:34:17',NULL,'2026-05-14 07:34:17'),(11,8,10,'2026-05-21 06:36:05','Tómo la pastilla con una salchica','2026-05-21 06:36:05'),(12,11,10,'2026-05-21 08:09:46','Administrado correctamente','2026-05-21 08:09:46');
/*!40000 ALTER TABLE `medication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medications`
--

DROP TABLE IF EXISTS `medications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint NOT NULL,
  `name` varchar(200) NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `frequency` enum('daily','every_12h','every_8h','weekly','as_needed') NOT NULL,
  `time_of_day` time NOT NULL,
  `second_time` time DEFAULT NULL,
  `third_time` time DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pet` (`pet_id`),
  KEY `idx_active` (`active`),
  KEY `idx_frequency` (`frequency`),
  CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medications`
--

LOCK TABLES `medications` WRITE;
/*!40000 ALTER TABLE `medications` DISABLE KEYS */;
INSERT INTO `medications` VALUES (5,8,'Apoquel','1 pastilla','every_12h','09:00:00','21:00:00',NULL,'2026-03-01',NULL,'Con comida',1,'2026-03-29 08:45:24','2026-03-29 08:45:24'),(6,7,'Vitamina D','1 cápsula','daily','08:00:00',NULL,NULL,'2026-03-01',NULL,NULL,1,'2026-03-29 08:52:24','2026-03-29 08:52:24'),(7,13,'Antibiótico','250mg','every_12h','08:00:00',NULL,NULL,'2026-04-14','2026-04-21','Administrar con comida',1,'2026-04-14 09:20:34','2026-04-14 09:20:34'),(8,14,'Apoquel','1 comprimido','daily','08:00:00',NULL,NULL,'2023-06-12',NULL,'Puede administrarse solo',1,'2026-05-13 09:40:39','2026-05-13 09:40:39'),(10,14,'Desparasitación','1 comprimido','daily','15:00:00',NULL,NULL,'2026-05-14','2026-05-14',NULL,1,'2026-05-14 07:34:07','2026-05-14 07:34:07'),(11,17,'Vitamina','Media pastilla','daily','10:00:00',NULL,NULL,'2026-05-15',NULL,NULL,1,'2026-05-15 08:36:20','2026-05-15 08:36:20');
/*!40000 ALTER TABLE `medications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pets`
--

DROP TABLE IF EXISTS `pets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `household_id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `species` enum('dog','cat') DEFAULT NULL,
  `breed_id` bigint DEFAULT NULL,
  `custom_breed` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL COMMENT 'Peso en kg',
  `gender` enum('male','female','unknown') DEFAULT 'unknown',
  `allergies` text,
  `medical_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_household` (`household_id`),
  KEY `idx_species` (`species`),
  KEY `idx_breed` (`breed_id`),
  CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`breed_id`) REFERENCES `breeds` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pets`
--

LOCK TABLES `pets` WRITE;
/*!40000 ALTER TABLE `pets` DISABLE KEYS */;
INSERT INTO `pets` VALUES (7,6,'Luna','cat',3,NULL,NULL,NULL,'female',NULL,NULL,'2026-03-12 18:45:05','2026-03-12 18:45:05'),(8,6,'Thor','dog',62,NULL,NULL,28.00,'male','Polen, polvo','Operado de cadera en 2024','2026-03-27 10:27:21','2026-03-27 10:38:29'),(10,6,'Estella','cat',81,NULL,'2021-08-10',4.20,'female',NULL,'Vacunada en enero 2026','2026-03-27 10:29:28','2026-03-27 10:29:28'),(11,6,'Rex','dog',NULL,'Mestizo de Husky','2019-03-20',30.00,'male',NULL,NULL,'2026-03-27 10:31:25','2026-03-27 10:31:25'),(12,6,'Pancho','dog',2,NULL,'2020-05-15',25.50,'male',NULL,NULL,'2026-03-27 10:47:49','2026-03-27 10:47:49'),(13,9,'Canela','dog',NULL,'Golden Retriever','2020-03-15',30.50,'female',NULL,'Saludable','2026-04-14 09:12:21','2026-04-14 09:12:21'),(14,11,'Rayo','dog',8,NULL,'2021-05-02',20.00,'male','Alergico a los champus','Toma una pastilla antihestaminica al dia','2026-05-08 14:45:22','2026-05-08 14:51:53'),(16,13,'Oreo','cat',80,NULL,'2026-05-02',5.00,'female',NULL,NULL,'2026-05-14 06:00:51','2026-05-14 06:00:51'),(17,14,'Jazinto','cat',84,NULL,'2019-11-14',10.00,'male',NULL,NULL,'2026-05-14 06:36:27','2026-05-14 06:36:27'),(18,11,'Dory','dog',5,NULL,'2018-10-10',5.00,'female',NULL,NULL,'2026-05-15 08:45:28','2026-05-15 08:45:28');
/*!40000 ALTER TABLE `pets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'María López','maria@email.com','pass456','2026-03-11 11:00:03'),(7,'María López','marialopez@email.com','$2a$10$TE/Og7GLDyQ76ujHDoEeD.LSvJj7y4v94JJroIVFQyse6JA.6VJl6','2026-03-21 13:14:24'),(8,'Ana García','ana@email.com','$2a$10$kkNvodE6dTBW/EVeqWLO4uy7ssJgcvrN1aeqDbyG/wbsRalVYp6NS','2026-03-21 14:15:45'),(9,'Laura','laura@mail.com','$2a$10$uAaY0ZgeD9PxCEhmTHWnyuS/eje5MmevXsmnZYubpp8EWHmTkfDty','2026-04-15 07:57:48'),(10,'Ainho','ainhoa@gmail.com','$2a$10$bpDdr4.sxwoMGWnc0.pPP.MGis2L3A341iULIMN6xxZh6V0GHnRKK','2026-04-29 07:11:28'),(11,'Lucia','lucia@gmail.com','$2a$10$nYTb8y9VsBOA92kVbN5QA.fNaAG8I08.6LHS3RGs/0x7MM37ObCQa','2026-05-13 05:56:03');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `walks`
--

DROP TABLE IF EXISTS `walks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `walks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pet_id` bigint NOT NULL,
  `walked_by_user_id` bigint DEFAULT NULL,
  `walked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration_minutes` int DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `had_pee` tinyint(1) DEFAULT NULL,
  `had_poop` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pet` (`pet_id`),
  KEY `idx_user` (`walked_by_user_id`),
  KEY `idx_walked_at` (`walked_at`),
  KEY `idx_pet_date` (`pet_id`,`walked_at`),
  CONSTRAINT `walks_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `walks_ibfk_2` FOREIGN KEY (`walked_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `walks`
--

LOCK TABLES `walks` WRITE;
/*!40000 ALTER TABLE `walks` DISABLE KEYS */;
INSERT INTO `walks` VALUES (4,11,NULL,'2026-04-10 07:15:19',45,'Parque del Retiro - muy activo','2026-04-10 07:15:19',NULL,NULL),(5,11,NULL,'2026-04-10 07:16:46',30,'Paseo corto por el barrio','2026-04-10 07:16:46',NULL,NULL),(6,11,NULL,'2026-04-10 07:17:01',30,'Paseo corto por el barrio','2026-04-10 07:17:01',NULL,NULL),(7,13,NULL,'2026-04-14 09:27:10',30,'Paseo por el parque','2026-04-14 09:27:10',NULL,NULL),(10,14,10,'2026-05-21 06:48:31',10,NULL,'2026-05-21 06:48:31',1,0);
/*!40000 ALTER TABLE `walks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-23 21:50:12
