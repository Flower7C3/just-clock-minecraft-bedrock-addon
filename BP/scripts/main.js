import {
    world, system, CommandPermissionLevel, CustomCommandStatus
} from "@minecraft/server";

///=================================================================================================================
// === Time tables ===
const STAGE_KEYS = [
    [0, 5000, "morning"],
    [5000, 6000, "before_noon"],
    [6000, 6100, "noon"],
    [6100, 12000, "after_noon"],
    [12000, 12542, "before_sunset"],
    [12542, 12786, "sunset"],
    [12786, 13000, "after_sunset"],
    [13000, 17000, "night"],
    [17000, 18000, "before_midnight"],
    [18000, 18100, "midnight"],
    [18100, 22000, "after_midnight"],
    [22000, 23000, "before_sunrise"],
    [23000, 23216, "sunrise"],
    [23216, 23460, "after_sunrise"],
    [23460, 24000, "morning"]
];

const MOON_KEYS = [
    "full", "waning_gibbous", "third_quarter", "waning_crescent",
    "new", "waxing_crescent", "first_quarter", "waxing_gibbous"
];

///=================================================================================================================
// === Helpers ===
function getDayTime(tick) {
    const hourMod = ((tick + 6000) / 1000) % 24;
    const hour = String(Math.trunc(hourMod)).padStart(2, "0");
    const minuteMod = (hourMod - Number(hour)) * 60;
    const minute = String(Math.trunc(minuteMod)).padStart(2, "0");
    const sec = String(Math.trunc((minuteMod - Number(minute)) * 60)).padStart(2, "0");
    return `${hour}:${minute}:${sec}`;
}

function getDayStageKey(tick) {
    for (const [from, to, key] of STAGE_KEYS) {
        if (tick >= from && tick < to) return key;
    }
    return "morning";
}

function tell(origin, message) {
    const player = origin.sourceEntity;
    if (player?.sendMessage) player.sendMessage(message);
}

///=================================================================================================================
// === Commands ===
system.beforeEvents.startup.subscribe((initEvent) => {
    const commandRegistry = initEvent.customCommandRegistry;
    commandRegistry.registerCommand({
        name: "just-clock:whats-time",
        description: "Display current time",
        permissionLevel: CommandPermissionLevel.Any
    }, (origin) => {
        const tick = world.getTimeOfDay();
        tell(origin, {
            rawtext: [
                {translate: "just_clock.time", with: [getDayTime(tick)]},
                {text: " "},
                {translate: `just_clock.stage.${getDayStageKey(tick)}`}
            ]
        });
        return {status: CustomCommandStatus.Success};
    });
    commandRegistry.registerCommand({
        name: "just-clock:whats-moon-phase",
        description: "Display current moon phase",
        permissionLevel: CommandPermissionLevel.Any
    }, (origin) => {
        const key = MOON_KEYS[world.getMoonPhase()] ?? MOON_KEYS[0];
        tell(origin, {translate: `just_clock.moon.${key}`});
        return {status: CustomCommandStatus.Success};
    });
});
