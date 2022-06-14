use dev_dbtcplus;

DELIMITER $$
CREATE FUNCTION levenshtein( s1 VARCHAR(255), s2 VARCHAR(255) )
    RETURNS INT
    DETERMINISTIC
    BEGIN
        DECLARE s1_len, s2_len, i, j, c, c_temp, cost INT;
        DECLARE s1_char CHAR;
        DECLARE cv0, cv1 VARBINARY(256);

        SET s1_len = CHAR_LENGTH(s1), s2_len = CHAR_LENGTH(s2), cv1 = 0x00, j = 1, i = 1, c = 0;

        IF s1 = s2 THEN
            RETURN 0;
        ELSEIF s1_len = 0 THEN
            RETURN s2_len;
        ELSEIF s2_len = 0 THEN
            RETURN s1_len;
        ELSE
            WHILE j <= s2_len DO
                SET cv1 = CONCAT(cv1, UNHEX(HEX(j))), j = j + 1;
            END WHILE;
            WHILE i <= s1_len DO
                SET s1_char = SUBSTRING(s1, i, 1), c = i, cv0 = UNHEX(HEX(i)), j = 1;
                WHILE j <= s2_len DO
                    SET c = c + 1;
                    IF s1_char = SUBSTRING(s2, j, 1) THEN
                        SET cost = 0; ELSE SET cost = 1;
                    END IF;
                    SET c_temp = CONV(HEX(SUBSTRING(cv1, j, 1)), 16, 10) + cost;
                    IF c > c_temp THEN SET c = c_temp; END IF;
                    SET c_temp = CONV(HEX(SUBSTRING(cv1, j+1, 1)), 16, 10) + 1;
                    IF c > c_temp THEN
                        SET c = c_temp;
                    END IF;
                    SET cv0 = CONCAT(cv0, UNHEX(HEX(c))), j = j + 1;
                END WHILE;
                SET cv1 = cv0, i = i + 1;
            END WHILE;
        END IF;
        RETURN c;
    END$$
DELIMITER ;

DELIMITER $$

DROP FUNCTION IF EXISTS `longest_common_substring` $$
CREATE FUNCTION `longest_common_substring`(short_str TEXT, long_str TEXT) RETURNS text CHARSET utf8
    NO SQL
    DETERMINISTIC
BEGIN
-- http://stackoverflow.com/questions/35545281/mysql-longest-common-substring
DECLARE short_len INT DEFAULT CHAR_LENGTH(short_str);
DECLARE long_len INT DEFAULT CHAR_LENGTH(long_str);
DECLARE swap_str TEXT;

DECLARE max_matched_len INT DEFAULT 0;
DECLARE max_at_left_marker INT DEFAULT NULL;
DECLARE max_at_match_len INT DEFAULT NULL;
DECLARE left_marker INT DEFAULT 0;
DECLARE match_len INT DEFAULT NULL;

IF short_str IS NULL OR long_str IS NULL THEN
  RETURN NULL;
ELSEIF short_str = long_str THEN
  RETURN short_str;
END IF;

IF short_len > long_len THEN
  SET swap_str = long_str;
  SET long_str = short_str;
  SET short_str = swap_str;
  SET short_len = long_len;
  SET long_len = CHAR_LENGTH(long_str);
END IF;

left_loop:
LOOP
  SET left_marker = left_marker + 1;
  IF left_marker + max_matched_len > short_len THEN
    LEAVE left_loop;
  END IF;
  SET match_len = max_matched_len;
  right_loop:
  LOOP
    SET match_len = match_len + 1;
    IF 1 - left_marker + match_len > short_len THEN
      LEAVE right_loop;
    END IF;
    IF long_str LIKE CONCAT ('%',SUBSTRING(short_str FROM left_marker FOR match_len),'%') THEN
      SET max_matched_len = match_len, max_at_left_marker = left_marker;
    ELSE
      LEAVE right_loop;
    END IF;
  END LOOP;
END LOOP;

IF (max_matched_len) THEN
  RETURN SUBSTRING(short_str FROM max_at_left_marker FOR max_matched_len);
ELSE
  RETURN NULL;
END IF;

END $$

DELIMITER ;

insert into user (name, email, login, password, active, created_at, updated_at) value('adm', 'adm@adm.com', 'adm', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 1, '2022-06-10 23:55:28.000', '2022-06-10 23:55:28.000');

INSERT INTO `dev_dbtcplus`.`glucose_record` (`mg_per_dl`, `was_there_consumption`, `consumption`, `insulin_doses_used`, `user_id`, `created_at`, `updated_at`) 
VALUES ('206', '1', 'pedaço de bolo', '20', '1', '2022-06-11 08:00:00', '2022-06-11 08:00:00'),
('120', '1', 'arroz, frango empanado e ovos', '20', '1', '2022-06-11 13:00:00', '2022-06-11 13:00:00'),
('140', '1', 'cheetos lua requeijão grande', '25', '1', '2022-06-11 17:00:00', '2022-06-11 17:00:00'),
('200', '1', 'meia pizza pepperoni', '50', '1', '2022-06-11 21:00:00', '2022-06-11 21:00:00'),
('230', '1', 'meio pacote de presuntinho', '30', '1', '2022-06-12 08:00:00', '2022-06-12 08:00:00'),
('188', '1', 'arroz, frango empanado e ovos', '24', '1', '2022-06-12 13:00:00', '2022-06-12 13:00:00'),
('95', '1', 'cheetos lua requeijão grande', '25', '1', '2022-06-12 17:00:00', '2022-06-12 17:00:00'),
('150', '1', 'arroz feijão e nuggets', '20', '1', '2022-06-12 21:00:00', '2022-06-12 21:00:00');