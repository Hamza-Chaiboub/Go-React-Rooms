ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_name_key ;
ALTER TABLE rooms ADD CONSTRAINT rooms_createdby_name_key UNIQUE (created_by, name);