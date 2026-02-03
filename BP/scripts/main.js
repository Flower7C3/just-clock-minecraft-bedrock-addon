import {
world, system, StartupEvent, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus,
} from "@minecraft/server";

// === Rejestracja komponentów ===
system.beforeEvents.startup.subscribe((initEvent) => {
    const commandRegistry = initEvent.customCommandRegistry;
    commandRegistry.registerCommand({
        name: "just-clock:whats-time",
        description: "Display current time",
        permissionLevel: CommandPermissionLevel.Any,
    }, (origin) => {
        const tick = world.getTimeOfDay();
	    const time = getDayTime(tick);
	    const suffix = getDayStage(tick);
        return {
            status: CustomCommandStatus.Success,
            message: `It is ${time} ${suffix}`
        };
    });
    commandRegistry.registerCommand({
        name: "just-clock:whats-moon-phase",
        description: "Display current moon phase",
        permissionLevel: CommandPermissionLevel.Any,
    }, (origin) => {
        const moonPhaseName = getMoonPhase();

        return {
            status: CustomCommandStatus.Success,
            message: `Current moon phase is ${moonPhaseName}`
        };
    });
});

function getDayTime(tick) {
    const hour_mod = ((tick + 6000) / 1000) % 24;
    const hour = String(parseInt(hour_mod)).padStart(2, '0');
    const minute_mod = (hour_mod - hour) * 60;
    const minute = String(parseInt(minute_mod)).padStart(2, '0');
    const sec_mod = (minute_mod - minute) * 60;
    const sec = String(parseInt(sec_mod)).padStart(2, '0');
    return `${hour}:${minute}:${sec}`;
}

function getDayStage(tick){
	switch(true){
		case 0 <= tick && tick < 5000:
			return "in the morning";
		case 5000 <= tick && tick < 6000:
			return "before noon";
		case 6000 <= tick && tick < 6100:
			return "at noon";
		case 6100 <= tick && tick < 12000:
			return "after noon";
		case 12000 <= tick && tick < 12542:
			return "before sunset";
		case 12542 <= tick && tick < 12786:
			return "at sunset";
		case 12786 <= tick && tick < 13000:
			return "after sunset";
		case 13000 <= tick && tick < 17000:
			return "in the night";
		case 17000 <= tick && tick < 18000:
			return "before midnight";
		case 18000 <= tick && tick < 18100:
			return "at midnight";
		case 18100 <= tick && tick < 22000:
			return "after midnight";
		case 22000 <= tick && tick < 23000:
			return "before sunrise";
		case 23000 <= tick && tick < 23216:
			return "at sunrise";
		case 23216 <= tick && tick < 23460:
			return "after sunrise";
		case 23460 <= tick:
			return "in the morning";
		break;
		default:
			return "";
	}
}

function getMoonPhase(){
	switch(world.getMoonPhase()){
		case 0: return "full moon [1]"; // 🌕
		case 1: return "waning gibbous [³⁄₄ → 0]"; // 🌖
		case 2: return "third quarter [²⁄₄ → 0]"; // 🌗
		case 3: return "waning crescent [¼ → 0]"; // 🌘
		case 4: return "new moon [0]"; // 🌑
		case 5: return "waxing crescent [¹⁄₄ → 1]"; // 🌒
		case 6: return "first quarter [²⁄₄ → 1]"; // 🌓
		case 7: return "waxing gibbous [³⁄₄ → 1]"; // 🌔
	}
}