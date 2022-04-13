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
-- Table structure for table `definitions`
--

DROP TABLE IF EXISTS `definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `definitions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `englishDefinition` varchar(255) NOT NULL,
  `armenianDefinition` varchar(255) NOT NULL,
  `translationId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `translationId` (`translationId`),
  CONSTRAINT `definitions_ibfk_1` FOREIGN KEY (`translationId`) REFERENCES `translations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `definitions`
--

LOCK TABLES `definitions` WRITE;
/*!40000 ALTER TABLE `definitions` DISABLE KEYS */;
INSERT INTO `definitions` VALUES (10,'Ucom is an operator.','Յուքոմն օպերատոր է։',59),(11,'The metre is a unit of length in the International System of Units.','Երկարության չափման միավոր է միավորների մետրական և միջազգային համակարգերում:',760),(12,'Couple definition 1.','Զույգի սահմանում 1։',112),(13,'Couple definition 2.','Զույգի սահմանում 2։',112),(16,'Water (chemical formula H2O) is an inorganic, transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s hydrosphere and the fluids of all known living organisms (in which it acts as a solvent).','Ջուր, անօրգանական միացություն, ջրածնի օքսիդ, քիմիական բանաձևը՝ H2O։ Ջուրը բնության ամենատարածված նյութն է, բնության մեջ հանդիպում է պինդ, հեղուկ, գազային վիճակներում։ Կազմում է կենդանի օրգանիզմների բաղադրության 2/3 մասը։',100);
/*!40000 ALTER TABLE `definitions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-13 20:33:11
