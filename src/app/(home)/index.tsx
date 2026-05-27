/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(home)/sections/index.tsx

// 1. Hero
import { VersionOne as HeroV1 } from "./_hero/VersionOne";
import { VersionTwo as HeroV2 } from "./_hero/VersionTwo";
import { VersionThree as HeroV3 } from "./_hero/VersionThree";
import { VersionFour as HeroV4 } from "./_hero/VersionFour";

// 2. Amenities
import { VersionOne as AmenitiesV1 } from "./_amenities/VersionOne";
import { VersionTwo as AmenitiesV2 } from "./_amenities/VersionTwo";
import { VersionThree as AmenitiesV3 } from "./_amenities/VersionThree";
import { VersionFour as AmenitiesV4 } from "./_amenities/VersionFour";

// 3. Gallery
import { VersionOne as GalleryV1 } from "./_gallery/VersionOne";
import { VersionTwo as GalleryV2 } from "./_gallery/VersionTwo";

// 4. Location
import { VersionOne as LocationV1 } from "./_location/VersionOne";
import { VersionTwo as LocationV2 } from "./_location/VersionTwo";

// 5. Floor Plans (NEW)
import { VersionOne as FloorPlansV1 } from "./_floorplans/VersionOne";
import { VersionTwo as FloorPlansV2 } from "./_floorplans/VersionTwo";
import { VersionThree as FloorPlansV3 } from "./_floorplans/VersionThree";
import { HeroVideo } from "./_hero/HeroVideo";

export const ComponentRegistry: Record<string, Record<string, any>> = {
  Hero: {
    VersionOne: HeroV1,
    VersionTwo: HeroV2,
    VersionThree: HeroV3,
    VersionFour: HeroV4,
    VersionFive: HeroVideo,
  },
  Amenities: {
    VersionOne: AmenitiesV1,
    VersionTwo: AmenitiesV2,
    VersionThree: AmenitiesV3,
    VersionFour: AmenitiesV4,
  },
  Gallery: {
    VersionOne: GalleryV1,
    VersionTwo: GalleryV2,
  },
  Location: {
    VersionOne: LocationV1,
    VersionTwo: LocationV2,
  },
  FloorPlans: {
    VersionOne: FloorPlansV1,
    VersionTwo: FloorPlansV2,
    VersionThree: FloorPlansV3,
  }
};