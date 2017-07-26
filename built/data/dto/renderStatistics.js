var renderPro;
(function (renderPro) {
    var data;
    (function (data) {
        var dto;
        (function (dto) {
            var RenderStatisticsDTO = (function () {
                function RenderStatisticsDTO(frameTime, numDrawCalls, numTextureSwitches, numProgramSwitches, rendererName) {
                    if (frameTime === void 0) { frameTime = 0; }
                    if (numDrawCalls === void 0) { numDrawCalls = 0; }
                    if (numTextureSwitches === void 0) { numTextureSwitches = 0; }
                    if (numProgramSwitches === void 0) { numProgramSwitches = 0; }
                    Application.Debug.assert(frameTime >= 0);
                    Application.Debug.assert(numDrawCalls >= 0);
                    Application.Debug.assert(numTextureSwitches >= 0);
                    Application.Debug.assert(numProgramSwitches >= 0);
                    this.m_frameTime = frameTime;
                    this.m_numDrawCalls = numDrawCalls;
                    this.m_numProgramSwitches = numProgramSwitches;
                    this.m_numTextureSwitches = numTextureSwitches;
                    this.m_rendererName = rendererName;
                }
                RenderStatisticsDTO.prototype.clear = function () {
                    this.m_frameTime = 0;
                    this.m_numDrawCalls = 0;
                    this.m_numProgramSwitches = 0;
                    this.m_numTextureSwitches = 0;
                    this.m_rendererName = "";
                };
                return RenderStatisticsDTO;
            }());
            dto.RenderStatisticsDTO = RenderStatisticsDTO;
        })(dto = data.dto || (data.dto = {}));
    })(data = renderPro.data || (renderPro.data = {}));
})(renderPro || (renderPro = {}));
