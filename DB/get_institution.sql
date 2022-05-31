-- PROCEDURE: public.get_institution_or_insert(character varying, integer)

-- DROP PROCEDURE IF EXISTS public.get_institution_or_insert(character varying, integer);

CREATE OR REPLACE PROCEDURE public.get_institution_or_insert(
	institutionname character varying,
	INOUT institution_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	IF NOT EXISTS (SELECT "Institution".institution_id FROM "Institution" WHERE "Institution".name = institutionName) 
	THEN
			INSERT INTO "Institution"(name, deleted, date_created)
				VALUES (institutionName, b'0', date(now())) RETURNING "Institution".institution_id INTO institution_id;
	ELSE
		SELECT "Institution".institution_id INTO institution_id FROM "Institution" WHERE "Institution".name = institutionName LIMIT 1;
	END IF;
END;
$BODY$;

ALTER PROCEDURE public.get_institution_or_insert(character varying, integer)
    OWNER TO lluidxtdrxwkpz;
	
SELECT * FROM "Tender"
