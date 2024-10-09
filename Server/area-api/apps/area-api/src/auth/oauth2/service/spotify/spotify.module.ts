import { Module } from "@nestjs/common";
import { SpotifyService } from "./spotify.service";
import { SpotifyController } from "./spotify.controller";
import { HashToolService } from "apps/area-api/src/utils/hashtool.service";
import { DatabaseModule } from "apps/area-api/src/database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [SpotifyController],
    providers: [SpotifyService, HashToolService],
    exports: [SpotifyService]
})

export class SpotifyModule {

}