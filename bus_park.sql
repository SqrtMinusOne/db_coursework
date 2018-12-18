-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: localhost    Database: bus_park
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `available_drivers_with_buses`
--

DROP TABLE IF EXISTS `available_drivers_with_buses`;
/*!50001 DROP VIEW IF EXISTS `available_drivers_with_buses`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `available_drivers_with_buses` AS SELECT 
 1 AS `passport_data`,
 1 AS `bus_number`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `bus_types`
--

DROP TABLE IF EXISTS `bus_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bus_types` (
  `type` varchar(40) CHARACTER SET utf8 NOT NULL COMMENT 'Тип автобуса',
  `capacity` int(11) NOT NULL COMMENT 'Вместимость',
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Типы автобусов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_types`
--

LOCK TABLES `bus_types` WRITE;
/*!40000 ALTER TABLE `bus_types` DISABLE KEYS */;
INSERT INTO `bus_types` VALUES ('Icarus',40),('Setra',52),('МАЗ',10);
/*!40000 ALTER TABLE `bus_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buses` (
  `bus_number` int(11) NOT NULL COMMENT '№ автобуса',
  `type` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT 'Тип автобуса',
  `available` tinyint(1) NOT NULL COMMENT 'Доступен сегодня',
  PRIMARY KEY (`bus_number`),
  KEY `bus_type` (`type`),
  CONSTRAINT `bus_type` FOREIGN KEY (`type`) REFERENCES `bus_types` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Автобусы';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (15,'Icarus',1),(25,'Icarus',1),(31,'Setra',0),(45,'Icarus',1),(56,'Icarus',1),(79,'МАЗ',1),(82,'Setra',1),(93,'МАЗ',1),(138,'Setra',1),(173,'МАЗ',1);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `buses_by_type`
--

DROP TABLE IF EXISTS `buses_by_type`;
/*!50001 DROP VIEW IF EXISTS `buses_by_type`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `buses_by_type` AS SELECT 
 1 AS `type`,
 1 AS `available`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `buses_not_on_line`
--

DROP TABLE IF EXISTS `buses_not_on_line`;
/*!50001 DROP VIEW IF EXISTS `buses_not_on_line`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `buses_not_on_line` AS SELECT 
 1 AS `bus_number`,
 1 AS `Отсутствие водителя`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `class_coef`
--

DROP TABLE IF EXISTS `class_coef`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `class_coef` (
  `class` varchar(40) CHARACTER SET utf8 NOT NULL COMMENT 'Класс',
  `coef` float NOT NULL COMMENT 'Коэффициент класса',
  PRIMARY KEY (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Коэффициенты классов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_coef`
--

LOCK TABLES `class_coef` WRITE;
/*!40000 ALTER TABLE `class_coef` DISABLE KEYS */;
INSERT INTO `class_coef` VALUES ('1',1.5),('2',1.25),('3',1);
/*!40000 ALTER TABLE `class_coef` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day_schedule`
--

DROP TABLE IF EXISTS `day_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `day_schedule` (
  `passport` varchar(40) CHARACTER SET utf8 DEFAULT NULL,
  `bus` int(11) DEFAULT NULL,
  `route` int(11) DEFAULT NULL,
  UNIQUE KEY `day_schedule_bus_uindex` (`bus`),
  UNIQUE KEY `day_schedule_passport_uindex` (`passport`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Расписание на день';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day_schedule`
--

LOCK TABLES `day_schedule` WRITE;
/*!40000 ALTER TABLE `day_schedule` DISABLE KEYS */;
INSERT INTO `day_schedule` VALUES ('1294 901515',25,71),('2343 493443',NULL,91),(NULL,NULL,92),('5124 239448',56,225),('7314 780245',79,32),('8312 235733',82,71),('9212 945783',93,91),(NULL,NULL,228);
/*!40000 ALTER TABLE `day_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `day_schedule_wo_passport`
--

DROP TABLE IF EXISTS `day_schedule_wo_passport`;
/*!50001 DROP VIEW IF EXISTS `day_schedule_wo_passport`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `day_schedule_wo_passport` AS SELECT 
 1 AS `driver_name`,
 1 AS `bus`,
 1 AS `route`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drivers` (
  `passport_data` varchar(40) CHARACTER SET utf8 NOT NULL COMMENT 'Паспортные данные',
  `driver_name` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT 'ФИО',
  `class` varchar(40) CHARACTER SET utf8 NOT NULL COMMENT 'Класс',
  `experience` int(11) NOT NULL COMMENT 'Стаж',
  `available` tinyint(1) NOT NULL COMMENT 'Доступен сегодня',
  PRIMARY KEY (`passport_data`),
  KEY `drivers_class_coef_class_fk` (`class`),
  CONSTRAINT `drivers_class_coef_class_fk` FOREIGN KEY (`class`) REFERENCES `class_coef` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Водители';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES ('1294 901515','Линкольн Авраам Томас','2',25,1),('2343 493443','Сахаров Андрей Дмитриевич','2',34,1),('4012 572188','Корытов Павел Валерьевич','3',1,0),('5124 239448','Керенский Александр Федорович','1',25,1),('7314 780245','Черчилль Уинстон Спенсер','1',34,1),('8312 235733','Рузвельт Франклин Делано','1',40,1),('9212 945783','Деникин Антон Иванович','3',15,1);
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `drivers_by_class`
--

DROP TABLE IF EXISTS `drivers_by_class`;
/*!50001 DROP VIEW IF EXISTS `drivers_by_class`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `drivers_by_class` AS SELECT 
 1 AS `class`,
 1 AS `Total`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `drivers_with_buses`
--

DROP TABLE IF EXISTS `drivers_with_buses`;
/*!50001 DROP VIEW IF EXISTS `drivers_with_buses`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `drivers_with_buses` AS SELECT 
 1 AS `passport_data`,
 1 AS `bus`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `experience_coef`
--

DROP TABLE IF EXISTS `experience_coef`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experience_coef` (
  `experience_lower` int(11) NOT NULL COMMENT 'Нижняя граница',
  `experience_upper` int(11) NOT NULL COMMENT 'Верхняя граница',
  `coef` float NOT NULL COMMENT 'Коэффицент',
  PRIMARY KEY (`experience_lower`,`experience_upper`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Стаж';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience_coef`
--

LOCK TABLES `experience_coef` WRITE;
/*!40000 ALTER TABLE `experience_coef` DISABLE KEYS */;
INSERT INTO `experience_coef` VALUES (0,3,1),(4,7,1.6),(8,10,1.8),(11,15,2),(16,20,2.3),(21,25,2.6),(26,35,3),(36,100,3.5);
/*!40000 ALTER TABLE `experience_coef` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferred`
--

DROP TABLE IF EXISTS `preferred`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `preferred` (
  `passport` varchar(40) CHARACTER SET utf8 NOT NULL COMMENT 'Паспортные данные',
  `bus` int(11) NOT NULL COMMENT 'Номер автобуса',
  `route` int(11) NOT NULL COMMENT 'Номер маршрута',
  PRIMARY KEY (`passport`,`bus`,`route`),
  UNIQUE KEY `preferred_bus_uindex` (`bus`),
  UNIQUE KEY `preferred_passport_uindex` (`passport`),
  KEY `preferred_route_index` (`route`),
  CONSTRAINT `preferred_buses_bus_number_fk` FOREIGN KEY (`bus`) REFERENCES `buses` (`bus_number`),
  CONSTRAINT `preferred_drivers_passport_data_fk` FOREIGN KEY (`passport`) REFERENCES `drivers` (`passport_data`),
  CONSTRAINT `preferred_routes_route_number_fk` FOREIGN KEY (`route`) REFERENCES `routes` (`route_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Предпочитают водить';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferred`
--

LOCK TABLES `preferred` WRITE;
/*!40000 ALTER TABLE `preferred` DISABLE KEYS */;
INSERT INTO `preferred` VALUES ('1294 901515',25,71),('2343 493443',31,91),('4012 572188',45,92),('5124 239448',56,225),('7314 780245',79,32),('8312 235733',82,71),('9212 945783',93,91);
/*!40000 ALTER TABLE `preferred` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `preferred_wo_passport`
--

DROP TABLE IF EXISTS `preferred_wo_passport`;
/*!50001 DROP VIEW IF EXISTS `preferred_wo_passport`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `preferred_wo_passport` AS SELECT 
 1 AS `driver_name`,
 1 AS `bus`,
 1 AS `route`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `routes` (
  `route_number` int(11) NOT NULL COMMENT 'Маршрут автобуса',
  `start_point` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT 'Начало',
  `end_point` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT 'Конец',
  `start_time` time NOT NULL COMMENT 'Время начала',
  `end_Time` time NOT NULL COMMENT 'Время окончания',
  `route_interval` int(11) NOT NULL COMMENT 'Интервал (мин)',
  `distance` float DEFAULT NULL COMMENT 'Протяженность (км)',
  PRIMARY KEY (`route_number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Маршруты автобусов';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (32,'Боровский','Железный Перебор','09:30:00','22:00:00',30,5),(71,'Боровский','Андреевский','10:00:00','23:00:00',45,10),(91,'Железный Перебор','Антипино','11:00:00','20:00:00',30,8),(92,'Антипино','Андреевский','11:30:00','19:30:00',90,10),(225,'Заводоуковск','Ялуторовск','13:00:00','17:00:00',120,7),(228,'Ялуторовск','Антипино','11:00:00','18:00:00',120,15);
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `routes_not_fully_covered`
--

DROP TABLE IF EXISTS `routes_not_fully_covered`;
/*!50001 DROP VIEW IF EXISTS `routes_not_fully_covered`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `routes_not_fully_covered` AS SELECT 
 1 AS `route`,
 1 AS `bus`,
 1 AS `reason`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `routes_not_fully_covered_today`
--

DROP TABLE IF EXISTS `routes_not_fully_covered_today`;
/*!50001 DROP VIEW IF EXISTS `routes_not_fully_covered_today`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `routes_not_fully_covered_today` AS SELECT 
 1 AS `route`,
 1 AS `bus`,
 1 AS `reason`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `available_drivers_with_buses`
--

/*!50001 DROP VIEW IF EXISTS `available_drivers_with_buses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `available_drivers_with_buses` AS select `drivers`.`passport_data` AS `passport_data`,`buses`.`bus_number` AS `bus_number` from (`bus_park`.`drivers_with_buses` `drivers` left join (select `bus_park`.`buses`.`bus_number` AS `bus_number` from `bus_park`.`buses` where (`bus_park`.`buses`.`available` = 1)) `buses` on((`buses`.`bus_number` = `drivers`.`bus`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `buses_by_type`
--

/*!50001 DROP VIEW IF EXISTS `buses_by_type`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `buses_by_type` AS select `buses`.`type` AS `type`,count(0) AS `available` from `buses` group by `buses`.`type` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `buses_not_on_line`
--

/*!50001 DROP VIEW IF EXISTS `buses_not_on_line`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `buses_not_on_line` AS (select `buses`.`bus_number` AS `bus_number`,'Отсутствие водителя' AS `Отсутствие водителя` from `buses` where `buses`.`bus_number` in (select `preferred`.`bus` from (`preferred` join `drivers` on((`preferred`.`passport` = `drivers`.`passport_data`))) where (`drivers`.`available` = 0))) union (select `buses`.`bus_number` AS `bus_number`,'Поломка автобуса' AS `Поломка автобуса` from `buses` where (`buses`.`available` = 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `day_schedule_wo_passport`
--

/*!50001 DROP VIEW IF EXISTS `day_schedule_wo_passport`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `day_schedule_wo_passport` AS select `drivers`.`driver_name` AS `driver_name`,`day_schedule`.`bus` AS `bus`,`day_schedule`.`route` AS `route` from (`day_schedule` left join `drivers` on((`day_schedule`.`passport` = `drivers`.`passport_data`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `drivers_by_class`
--

/*!50001 DROP VIEW IF EXISTS `drivers_by_class`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `drivers_by_class` AS select `drivers`.`class` AS `class`,count(0) AS `Total` from `drivers` group by `drivers`.`class` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `drivers_with_buses`
--

/*!50001 DROP VIEW IF EXISTS `drivers_with_buses`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `drivers_with_buses` AS select `drivers`.`passport_data` AS `passport_data`,`preferred`.`bus` AS `bus` from (`preferred` join `drivers`) where ((`drivers`.`passport_data` = `preferred`.`passport`) and (`drivers`.`available` = 1)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `preferred_wo_passport`
--

/*!50001 DROP VIEW IF EXISTS `preferred_wo_passport`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `preferred_wo_passport` AS select `drivers`.`driver_name` AS `driver_name`,`preferred`.`bus` AS `bus`,`preferred`.`route` AS `route` from (`preferred` left join `drivers` on((`preferred`.`passport` = `drivers`.`passport_data`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `routes_not_fully_covered`
--

/*!50001 DROP VIEW IF EXISTS `routes_not_fully_covered`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `routes_not_fully_covered` AS select `res`.`route` AS `route`,`res`.`bus` AS `bus`,`res`.`reason` AS `reason` from ((select `bus_park`.`preferred`.`route` AS `route`,`bus_park`.`buses`.`bus_number` AS `bus`,'Отсутствие водителя' AS `reason` from (`bus_park`.`preferred` join `bus_park`.`buses` on((`bus_park`.`preferred`.`bus` = `bus_park`.`buses`.`bus_number`))) where `bus_park`.`preferred`.`passport` in (select `bus_park`.`drivers`.`passport_data` from `bus_park`.`drivers` where (`bus_park`.`drivers`.`available` = 0))) union (select `bus_park`.`routes`.`route_number` AS `route`,NULL AS `bus`,'Водитель не назначен' AS `reason` from `bus_park`.`routes` where (not(`bus_park`.`routes`.`route_number` in (select `bus_park`.`preferred`.`route` from `bus_park`.`preferred`)))) union (select `bus_park`.`preferred`.`route` AS `route`,`bus_park`.`buses`.`bus_number` AS `bus`,'Поломка автобуса' AS `reason` from (`bus_park`.`preferred` join `bus_park`.`buses` on((`bus_park`.`preferred`.`bus` = `bus_park`.`buses`.`bus_number`))) where (`bus_park`.`buses`.`available` = 0))) `res` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `routes_not_fully_covered_today`
--

/*!50001 DROP VIEW IF EXISTS `routes_not_fully_covered_today`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `routes_not_fully_covered_today` AS select `coverage`.`route` AS `route`,`coverage`.`bus` AS `bus`,`coverage`.`reason` AS `reason` from (`bus_park`.`routes_not_fully_covered` `coverage` join `bus_park`.`day_schedule` on(((`bus_park`.`day_schedule`.`route` = `coverage`.`route`) and (isnull(`bus_park`.`day_schedule`.`bus`) or (`bus_park`.`day_schedule`.`bus` = `coverage`.`bus`))))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-18 12:16:55
