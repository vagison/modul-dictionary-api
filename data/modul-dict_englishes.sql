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
-- Table structure for table `englishes`
--

DROP TABLE IF EXISTS `englishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `englishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=814 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `englishes`
--

LOCK TABLES `englishes` WRITE;
/*!40000 ALTER TABLE `englishes` DISABLE KEYS */;
INSERT INTO `englishes` VALUES (1,'European Union'),(4,'input/output'),(6,'European United'),(17,'map'),(28,'zebra'),(29,'zombie'),(36,'fire'),(38,'marathon'),(39,'catch'),(60,'Ucom'),(61,'firefox'),(62,'mozila'),(79,'it'),(80,'information technologies'),(83,'Apple'),(87,'apple'),(90,'beam'),(91,'flange'),(92,'timber'),(94,'water budget'),(95,'computer'),(96,'emergency preparedness plan'),(97,'force'),(98,'Inner Text'),(99,'keyboard'),(100,'couple'),(181,'quality'),(288,'Republic of Armenia'),(289,'acceleration'),(290,'move'),(291,'Input/output'),(292,'color'),(293,'colour'),(294,'welding'),(295,'water conveyance system'),(296,'coating of pipeline'),(297,'rockfill'),(298,'earhfill'),(299,'rubble'),(300,'reinforcement bar'),(301,'spillway'),(302,'tamp'),(303,'geodetic works'),(304,'corrosion'),(305,'safety technique'),(306,'safety measures'),(307,'safety engineering'),(308,'fiberglass'),(309,'batch'),(310,'leakage'),(311,'catchment basin'),(312,'calibration'),(313,'salting'),(314,'salinization'),(316,'processing industry'),(317,'refrigeration industry'),(318,'share'),(319,'concentrates'),(320,'air release valve'),(321,'fittings'),(322,'funnel'),(323,'closing-regulating device'),(324,'hardening'),(325,'lifting equipment'),(326,'handling equipment'),(327,'valve'),(328,'plug'),(329,'water saturation'),(330,'unsaturated'),(331,'deposit'),(332,'sediment'),(333,'water turbidity'),(334,'outer forces'),(336,'T-shaped pipes'),(337,'transitions'),(338,'grain size distribution'),(339,'coarse-grain'),(340,'large-grained'),(341,'plot'),(342,'plantation'),(343,'perennial'),(344,'vineyards'),(345,'fruit orchards'),(346,'scattered'),(347,'curtilage'),(348,'polyethylene'),(349,'resin'),(350,'quartz sand'),(351,'constant pressure'),(352,'hermeticity'),(353,'impermeability'),(354,'elasticity'),(355,'flexibility'),(356,'rigidity'),(357,'backfill'),(358,'drill'),(359,'juncture'),(360,'junction'),(361,'joint'),(362,'socket connection'),(363,'polymerization'),(364,'ditch'),(365,'rim'),(366,'ridge'),(367,'prop'),(368,'diamond blade'),(369,'handsaw'),(370,'radius'),(371,'clamp'),(372,'blocker'),(373,'dismantle'),(374,'dismantling'),(375,'hose'),(376,'insulation'),(377,'bitumen-polymer mastic'),(378,'filler'),(379,'tire'),(380,'plasticizer'),(381,'lever'),(382,'super-oxidized'),(383,'baseline'),(384,'deoiling'),(385,'tub'),(386,'slag'),(387,'rust'),(388,'cast iron'),(389,'abrupt slope'),(390,'abutment'),(391,'accessary mineral'),(392,'alignment'),(393,'andesite'),(394,'ashy'),(395,'basaltic rocks'),(396,'bedrock'),(397,'bore hole'),(398,'borehole log'),(399,'boulder'),(400,'cobble'),(401,'casing'),(402,'cavity'),(403,'seepage'),(404,'clast'),(405,'clay'),(406,'configuration'),(407,'core'),(408,'core trench'),(409,'cross section'),(410,'scree'),(411,'distress'),(412,'drainage'),(413,'draft manual'),(414,'drill rig'),(415,'drilling'),(416,'drilling bits'),(417,'cutting bits'),(418,'drilling rig'),(419,'elevation'),(420,'embankment'),(421,'falling head permeability'),(422,'fault'),(423,'fibrous textured'),(424,'filter drain'),(425,'fine'),(426,'finegrained'),(427,'flow'),(428,'fractured massive'),(429,'fractured zone'),(430,'fragment'),(431,'fragmented'),(432,'friable cores'),(433,'friction angle'),(434,'grain crystal'),(435,'grievance redress mechanism'),(436,'grout curtain'),(437,'grouting'),(438,'grouting plot'),(439,'impervious'),(440,'isotop'),(441,'joint family'),(442,'joint-set'),(443,'less-fines'),(444,'leucocratic'),(445,'lime stone'),(446,'loam'),(447,'loamy sand'),(448,'longitudinal section'),(449,'Lugeon test'),(450,'mudstone'),(451,'massive fractured'),(452,'paleochannel'),(453,'paleosoil'),(454,'panel'),(455,'pebbles'),(456,'permeability'),(457,'permeable soil'),(458,'piezometer'),(459,'planar'),(460,'planar rough'),(461,'planar smooth'),(462,'pocket'),(470,'emptiness'),(494,'construction safety'),(512,'Adam\'s apple'),(517,'1st section'),(518,'access'),(519,'access building'),(520,'access canal'),(521,'access ramp'),(522,'access roads'),(523,'access shaft'),(524,'acoustic comfort'),(525,'action'),(526,'actual carrying capacity'),(527,'actuator'),(528,'adverse slope'),(529,'aeration'),(530,'aeration duct'),(531,'aeration pipe'),(532,'aeration shafts'),(533,'analog input card'),(534,'air cavity '),(535,'frame air cavities'),(536,'air circuit breaker'),(537,'air duct'),(538,'air influx'),(539,'air intake'),(540,'air loover'),(541,'air pipe'),(542,'air pocket'),(543,'air valve'),(544,'air-blowing method'),(545,'air-break circuit breaker'),(546,'alarm horn'),(547,'alfalfa'),(548,'allowance'),(549,'alluvial-deluvial'),(550,'alluvium'),(551,'alternator'),(553,'ammeter'),(554,'analog ground'),(555,'anchor'),(556,'anchor grout'),(557,'anchor poker'),(558,'angle of deviation'),(559,'angle of divergence'),(560,'angle of incidence'),(561,'angular bending'),(562,'angular deviation'),(563,'angular gravel'),(564,'animal transportation networks'),(565,'annealed'),(566,'annual regulation reservoir'),(567,'annual storage'),(568,'anticline'),(569,'antiseepage'),(570,'anti-seepage'),(571,'antispyware'),(572,'affected person'),(573,'apex'),(574,'application for preliminary assessment'),(575,'approach slab'),(576,'approximate'),(577,'appurtenant structures'),(578,'apron'),(579,'aquatic life'),(580,'aquiclude'),(581,'aquifer'),(582,'arc welding machine'),(583,'arcing fault'),(584,'area of flow'),(585,'area-specific environmental management plan'),(586,'Armenia Territorial Development Fund'),(587,'Armenia-Turkey Bilateral Agreement'),(588,'array'),(589,'artesian well'),(590,'articulated connection'),(591,'as built'),(592,'assembly works'),(593,'at centerline spacing'),(596,'axis of bending'),(597,'axisymmetric'),(598,'backhoe'),(599,'backing pad'),(600,'backing ring'),(601,'backstopping'),(602,'backup'),(603,'backwater curve'),(604,'bad'),(605,'ball bearing'),(606,'ball valve'),(607,'ballast weight'),(608,'band tape'),(609,'bandwidth'),(610,'band width'),(611,'barley'),(612,'base flow'),(613,'base plate'),(614,'batching'),(615,'battens'),(616,'battery-backed'),(617,'beam flange'),(618,'beam with web openings'),(619,'beans'),(621,'bearing-type connection'),(622,'bedding'),(623,'bedding material'),(624,'bedding mortar'),(625,'bell end pipe'),(626,'bell-mouth'),(627,'bell-mouth spillway'),(628,'bell-shaped welding'),(629,'bench mark'),(630,'benchmark'),(631,'bend'),(632,'bend loss'),(633,'bentonite'),(634,'berm'),(635,'borehole'),(636,'biaxial bending'),(637,'bidder'),(638,'bill of quantities'),(639,'bill of quantity'),(640,'binder course'),(641,'bit'),(642,'bituminous paint'),(643,'bituminous varnish'),(644,'blade'),(645,'vane of a pump'),(646,'blanket'),(647,'blanket grouting'),(648,'blast mat'),(649,'blasthole'),(650,'blasting'),(651,'blind flange'),(652,'blind screw'),(653,'blinding concrete'),(654,'blocks'),(655,'massifs'),(656,'blower'),(657,'blowhole'),(658,'body'),(659,'boil'),(660,'bolt'),(661,'bonfire arrangement'),(662,'bonneted slide gate'),(663,'boom'),(664,'boom barrier'),(665,'boom gate'),(666,'boom crane'),(667,'lifting gate'),(668,'boom type'),(669,'border irrigation'),(670,'bore pile wall'),(671,'borehole logging'),(672,'borrow-area closure'),(673,'borrow pit'),(674,'bottom'),(675,'boulder-pebble'),(676,'boundary conditions'),(677,'box girder'),(678,'brace'),(679,'braced'),(680,'bracing system'),(681,'bracket'),(682,'braid'),(683,'brass'),(684,'breach'),(686,'breaking capacity'),(687,'breaking stress'),(688,'breather'),(689,'breeding bird'),(690,'breeding place'),(691,'bridge drick'),(692,'broken line'),(693,'brown coat'),(694,'brutto'),(695,'british standards'),(696,'bubble sensor'),(698,'bucket cavern'),(699,'buckling'),(700,'bulge'),(701,'bulging'),(702,'bulk density'),(703,'bulk water meter'),(704,'bulkhead'),(705,'bumper'),(706,'bumper beam'),(707,'bus'),(708,'bus coupler'),(709,'coupler switch'),(711,'busbar '),(712,'bush'),(713,'butt weld'),(714,'butterfly valve'),(715,'bypass road'),(720,'8-shaped stopper'),(722,'automatic transfer switch'),(723,'metre'),(725,'National University of Architecture and Construction of Armenia'),(727,'water'),(728,'water absorbtion'),(730,'zero water absorption'),(800,'open'),(811,'Buchholz relay');
/*!40000 ALTER TABLE `englishes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-03 11:50:49
