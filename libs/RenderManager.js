/**
 * Render manager
 *
 * @author  ijse
 */

module.exports = RenderManager;

// Render Class
// ============
// Manage renders for template
function RenderManager() {
    this.map = {
        "text": textRender,
        "json": jsonRender
    };

}

// Plain Text Render
// =================
// @param data  - text data
function textRender(res) {
    return function(data) {
        res.end(data);
    };
}

// Json Renderer
// =============
// @param data   - data model
function jsonRender(res) {
    return function(data) {
        res.json(data);
    };
}

RenderManager.prototype.add = function(name, render) {
    if(this.map[name]) {
        throw "Render " + name + " has been exist!";
    }
    this.map[name] = render;
};
RenderManager.prototype.get = function(name) {
    return this.map[name];
};
RenderManager.prototype.list = function(res) {
    var renderList = {};
    for(var name in this.map) {
        var render = this.map[name];
        renderList[name] = render(res);
    }
    return renderList;
};