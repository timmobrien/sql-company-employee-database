DROP DATABASE IF EXISTS `company_db`;

CREATE SCHEMA `company_db` ;

USE `company_db`;

CREATE TABLE `departments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `salary` DECIMAL NOT NULL,
  `department_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_roles_1_idx` (`department_id` ASC) VISIBLE,
  CONSTRAINT `fk_roles_1`
    FOREIGN KEY (`department_id`)
    REFERENCES `company_db`.`departments` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

CREATE TABLE `employees` (
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
`first_name` VARCHAR(255) NULL,
`last_name` VARCHAR(255) NULL,
`role_id` INT UNSIGNED NOT NULL,
`manager_id` INT UNSIGNED NULL,
PRIMARY KEY (`id`),
INDEX `fk_employees_1_idx` (`role_id` ASC) VISIBLE,
CONSTRAINT `fk_employees_1`
FOREIGN KEY (`role_id`)
REFERENCES `roles` (`id`)
ON DELETE CASCADE
ON UPDATE NO ACTION);

ALTER TABLE `employees` 
ADD INDEX `fk_employees_2_idx` (`manager_id` ASC) VISIBLE;

ALTER TABLE `employees` 
ADD CONSTRAINT `fk_employees_2`
  FOREIGN KEY (`manager_id`)
  REFERENCES `employees` (`id`)
  ON DELETE SET NULL
  ON UPDATE NO ACTION;