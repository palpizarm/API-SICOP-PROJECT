CREATE OR REPLACE PROCEDURE public.getLastUpdateTender(INOUT lastUpdate date)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	SELECT publication_date INTO lastUpdate FROM "Tender" ORDER BY "Tender".publication_date DESC LIMIT 1;
END;
$BODY$;