import { z } from "zod";

/*
    model EcoLocation {
        locationID String @id @default(cuid())
        areaID     Int    @default(autoincrement()) @db.UnsignedSmallInt
        location   String
        cn         String
        st         String

        site     Site         @relation(fields: [siteID], references: [siteID])
        siteID   String
        projects EcoProject[]

        isDelete  Boolean  @default(false)
        updatedAt DateTime @updatedAt

        @@index([areaID])
        @@index([siteID])
        @@map("eco_location")
    }
*/

export const createEcoLocationSchema = z.object({
	location: z.string().min(1, "A location is required."),
	cn: z
		.string()
		.min(2, "A country is required.")
		.max(2, "A country is required."),
	st: z
		.string()
		.min(2, "A state/province is required.")
		.max(2, "A state/province is required."),
	siteID: z.string().cuid()
});

export const updateEcoLocationSchema = createEcoLocationSchema
	.partial()
	.extend({
		locationID: z.string().cuid()
	});
// .catchall(z.literal(""));
