-- PROCEDURE: public.insert_tender(character varying, character varying, character varying, date, date, character varying, character varying)

DROP PROCEDURE IF EXISTS public.insert_tender(character varying, character varying, character varying, date, date, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.insert_tender(
	InId character varying,
	InDescription character varying,
	InPublicationDate date,
	InOpeningDate date,
	InCloseDate date,
	InBudget character varying,
	instatus character varying,
	ininstitutionname character varying,
	InRegions character varying[])
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	institutionId 	integer;
BEGIN
	-- get institution id
	CALL get_institution_or_insert(InInstitutionName, institutionId);	
	-- insert a tender
	INSERT INTO "Tender"(id, description, publication_date, opening_date, close_date, budget, status, deleted, institution_id, regions)
	VALUES (InId, InDescription, InPublicationDate, InOpeningDate, InCloseDate, InBudget, InStatus, b'0',institutionId, InRegions);
END;
$BODY$;

ALTER PROCEDURE public.insert_tender(character varying, character varying, character varying, date, date, character varying, character varying)
    OWNER TO lluidxtdrxwkpz;
