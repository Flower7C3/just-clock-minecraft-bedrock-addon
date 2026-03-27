#!/usr/bin/env python3
"""
Comprehensive verification script for Minecraft Bedrock Addon
Verifies project structure, files, and build readiness.

Same helper stack as sibling projects (minecraft_check / console_utils).
Behavior-only packs (no RP/): RP structure checks are skipped by minecraft_check.
Translation/texture steps from minecraft_check assume tile.* / catalog packs and are
omitted (same pattern as warp-points/verify_all.py).
"""
from minecraft_check import MinecraftUtils


def main():
    """Main verification function"""
    MinecraftUtils.verification_summary([
        MinecraftUtils.verify_config,
        MinecraftUtils.verify_manifests,
        MinecraftUtils.verify_project_structure,
        MinecraftUtils.count_project_files,
        MinecraftUtils.verify_blocks,
    ])


if __name__ == "__main__":
    main()
