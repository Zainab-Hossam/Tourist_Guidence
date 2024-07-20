-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2024 at 09:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `touriist guidence`
--

-- --------------------------------------------------------

--
-- Table structure for table `images_for_monument`
--

CREATE TABLE `images_for_monument` (
  `id` int(255) NOT NULL,
  `monument_id` int(255) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monument`
--

CREATE TABLE `monument` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `weather` int(255) NOT NULL,
  `historical_period` enum('ancient','modern') NOT NULL,
  `instructions` set('food','drink','pets','camera') NOT NULL DEFAULT 'camera',
  `availability` varchar(255) NOT NULL DEFAULT 'available from 12 am to 11 pm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `destination` int(11) NOT NULL,
  `description` text NOT NULL,
  `price` int(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `num_of_reservation` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(255) NOT NULL,
  `mobile_num` int(255) DEFAULT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 -> normal user\r\n1-> admin',
  `language` enum('English','Arabic') NOT NULL DEFAULT 'English',
  `currency` enum('EGP','dollar') NOT NULL DEFAULT 'EGP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_action_on_monument`
--

CREATE TABLE `user_action_on_monument` (
  `id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `monument_id` int(255) NOT NULL,
  `activity_type` enum('save','search','scan') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `images_for_monument`
--
ALTER TABLE `images_for_monument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `monument_id` (`monument_id`);

--
-- Indexes for table `monument`
--
ALTER TABLE `monument`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_action_on_monument`
--
ALTER TABLE `user_action_on_monument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_constr_id` (`user_id`),
  ADD KEY `monument_constr_id` (`monument_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `images_for_monument`
--
ALTER TABLE `images_for_monument`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monument`
--
ALTER TABLE `monument`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_action_on_monument`
--
ALTER TABLE `user_action_on_monument`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `images_for_monument`
--
ALTER TABLE `images_for_monument`
  ADD CONSTRAINT `images_for_monument_ibfk_1` FOREIGN KEY (`monument_id`) REFERENCES `monument` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_action_on_monument`
--
ALTER TABLE `user_action_on_monument`
  ADD CONSTRAINT `monument_constr_id` FOREIGN KEY (`monument_id`) REFERENCES `monument` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_constr_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
