-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: modul-dict
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `examples`
--

DROP TABLE IF EXISTS `examples`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examples` (
  `id` int NOT NULL AUTO_INCREMENT,
  `englishExample` varchar(255) NOT NULL,
  `armenianExample` varchar(255) NOT NULL,
  `translationId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `translationId` (`translationId`),
  CONSTRAINT `examples_ibfk_1` FOREIGN KEY (`translationId`) REFERENCES `translations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=344 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examples`
--

LOCK TABLES `examples` WRITE;
/*!40000 ALTER TABLE `examples` DISABLE KEYS */;
INSERT INTO `examples` VALUES (102,'my computer','իմ համակարգիչ',102),(265,'Citizen of RA.','ՀՀ քաղաքացի։',308),(269,'Beam for the building.','Շինության հեծան:',95),(270,'gravel bed','կոպճային բարձիկ',637),(273,'Timber can be used as a construction material.','Փայտանյութն օգտագործվում է որպես շինանյութ:',98),(307,'Annual marathon.','Ամենամյա մարաթոն։',38),(308,'Аnother marathon.','Այլ մարաթոն։',38),(309,'Apple is a fruit.','Խնձորը միրգ է:',90),(312,'dummy data','',758),(333,'I\'m not a Ucom subscriber','Ես չեմ օգտվում յուքոմից',59),(334,'Couple example 1.','Զույգի օրինակ 1։',112),(335,'Couple example 1.','Զույգի օրինակ 2։',112),(342,'dummy data','',93),(343,'I enjoy drinking water.','Ես սիրում եմ ջուր խմել։',100);
/*!40000 ALTER TABLE `examples` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-13 20:33:10
