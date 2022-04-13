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
-- Table structure for table `english_comparison_connectors`
--

DROP TABLE IF EXISTS `english_comparison_connectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `english_comparison_connectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `englishId` int DEFAULT NULL,
  `englishComparisonId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `englishId` (`englishId`),
  KEY `englishComparisonId` (`englishComparisonId`),
  CONSTRAINT `english_comparison_connectors_ibfk_1` FOREIGN KEY (`englishId`) REFERENCES `englishes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `english_comparison_connectors_ibfk_2` FOREIGN KEY (`englishComparisonId`) REFERENCES `english_comparisons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `english_comparison_connectors`
--

LOCK TABLES `english_comparison_connectors` WRITE;
/*!40000 ALTER TABLE `english_comparison_connectors` DISABLE KEYS */;
INSERT INTO `english_comparison_connectors` VALUES (4,826,36),(30,1,36),(95,6,77),(96,62,77),(134,727,97),(135,3611,97),(138,1,99),(139,100,99);
/*!40000 ALTER TABLE `english_comparison_connectors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-13 20:33:12
