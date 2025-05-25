-- MySQL Script generado y corregido
-- Fecha: sáb 24 may 2025

-- 🔧 Desactiva temporalmente restricciones
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Base de Datos: ssanchez321_4
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ssanchez321_4` DEFAULT CHARACTER SET utf8;
USE `ssanchez321_4`;

-- -----------------------------------------------------
-- Tabla: user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `iduser` VARCHAR(38) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` VARCHAR(700),
  `photo` VARCHAR(2048) NOT NULL DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Breezeicons-actions-22-im-user.svg',
  PRIMARY KEY (`iduser`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabla: movie
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `movie` (
  `idmovie` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `fecha` DATE NOT NULL,
  `duration` TIME NOT NULL,
  `likes` INT,
  `dislikes` INT,
  `movie` VARCHAR(2048) NOT NULL,
  `description` VARCHAR(700),
  `user_id` VARCHAR(38) NOT NULL,
  PRIMARY KEY (`idmovie`),
  CONSTRAINT `fk_movie_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`iduser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- 🔧 Restaurar configuraciones originales
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
