"use strict";
var _a;
exports.__esModule = true;
exports.resourceRecords = exports.shoe = exports.window = exports.tools = exports.shirt = exports.plank = exports.meat = exports.leather = exports.ingot = exports.grain = exports.glass = exports.feast = exports.coal = exports.cloth = exports.cattle = exports.brick = exports.bread = exports.barrel = exports.clay = exports.wood = exports.metal = exports.wool = exports.wheat = exports.placeholder = exports.unknown = exports.ResourceType = void 0;
var ResourceType;
(function (ResourceType) {
    ResourceType["placeholder"] = "placeholder";
    ResourceType["unknown"] = "unknown";
    // base resources
    ResourceType["clay"] = "clay";
    ResourceType["metal"] = "metal";
    ResourceType["wheat"] = "wheat";
    ResourceType["wood"] = "wood";
    ResourceType["wool"] = "wool";
    // secondary resources
    ResourceType["barrel"] = "barrel";
    ResourceType["bread"] = "bread";
    ResourceType["brick"] = "brick";
    ResourceType["cattle"] = "cattle";
    ResourceType["cloth"] = "cloth";
    ResourceType["coal"] = "coal";
    ResourceType["feast"] = "feast";
    ResourceType["glass"] = "glass";
    ResourceType["grain"] = "grain";
    ResourceType["ingot"] = "ingot";
    ResourceType["leather"] = "leather";
    ResourceType["meat"] = "meat";
    ResourceType["plank"] = "plank";
    ResourceType["shirt"] = "shirt";
    ResourceType["shoe"] = "shoe";
    ResourceType["tools"] = "tools";
    ResourceType["window"] = "window";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
// Special
exports.unknown = {
    type: ResourceType.unknown,
    value: 0,
    baseResource: true
};
exports.placeholder = {
    type: ResourceType.placeholder,
    value: 0,
    baseResource: true
};
// Base
exports.wheat = {
    type: ResourceType.wheat,
    value: 0,
    baseResource: true
};
exports.wool = {
    type: ResourceType.wool,
    value: 0,
    baseResource: true
};
exports.metal = {
    type: ResourceType.metal,
    value: 0,
    baseResource: true
};
exports.wood = {
    type: ResourceType.wood,
    value: 0,
    baseResource: true
};
exports.clay = {
    type: ResourceType.clay,
    value: 0,
    baseResource: true
};
// Secondary
exports.barrel = {
    type: ResourceType.barrel,
    value: 5,
    baseResource: false
};
exports.bread = {
    type: ResourceType.bread,
    value: 1,
    baseResource: false
};
exports.brick = {
    type: ResourceType.brick,
    value: 2,
    baseResource: false
};
exports.cattle = {
    type: ResourceType.cattle,
    value: 3,
    baseResource: false
};
exports.cloth = {
    type: ResourceType.cloth,
    value: 3,
    baseResource: false
};
exports.coal = {
    type: ResourceType.coal,
    value: 1,
    baseResource: false
};
exports.feast = {
    type: ResourceType.feast,
    value: 8,
    baseResource: false
};
exports.glass = {
    type: ResourceType.glass,
    value: 4,
    baseResource: false
};
exports.grain = {
    type: ResourceType.grain,
    value: 2,
    baseResource: false
};
exports.ingot = {
    type: ResourceType.ingot,
    value: 3,
    baseResource: false
};
exports.leather = {
    type: ResourceType.leather,
    value: 5,
    baseResource: false
};
exports.meat = {
    type: ResourceType.meat,
    value: 6,
    baseResource: false
};
exports.plank = {
    type: ResourceType.plank,
    value: 3,
    baseResource: false
};
exports.shirt = {
    type: ResourceType.shirt,
    value: 4,
    baseResource: false
};
exports.tools = {
    type: ResourceType.tools,
    value: 6,
    baseResource: false
};
exports.window = {
    type: ResourceType.window,
    value: 5,
    baseResource: false
};
exports.shoe = {
    type: ResourceType.shoe,
    value: 8,
    baseResource: false
};
exports.resourceRecords = (_a = {},
    // special
    _a[ResourceType.unknown] = exports.unknown,
    _a[ResourceType.placeholder] = exports.placeholder,
    // base
    _a[ResourceType.clay] = exports.clay,
    _a[ResourceType.metal] = exports.metal,
    _a[ResourceType.wheat] = exports.wheat,
    _a[ResourceType.wood] = exports.wood,
    _a[ResourceType.wool] = exports.wool,
    // secondary
    _a[ResourceType.barrel] = exports.barrel,
    _a[ResourceType.bread] = exports.bread,
    _a[ResourceType.brick] = exports.brick,
    _a[ResourceType.cattle] = exports.cattle,
    _a[ResourceType.cloth] = exports.cloth,
    _a[ResourceType.coal] = exports.coal,
    _a[ResourceType.feast] = exports.feast,
    _a[ResourceType.glass] = exports.glass,
    _a[ResourceType.grain] = exports.grain,
    _a[ResourceType.ingot] = exports.ingot,
    _a[ResourceType.leather] = exports.leather,
    _a[ResourceType.meat] = exports.meat,
    _a[ResourceType.plank] = exports.plank,
    _a[ResourceType.shirt] = exports.shirt,
    _a[ResourceType.shoe] = exports.shoe,
    _a[ResourceType.tools] = exports.tools,
    _a[ResourceType.window] = exports.window,
    _a);
//# sourceMappingURL=resources.js.map