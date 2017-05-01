/** @author Dino Bojadjievski, Sourcery (@bojadjievski) */
var renderPro;
(function (renderPro) {
    var dataStructures;
    (function (dataStructures) {
        var LinkedList = (function () {
            function LinkedList(data) {
                this.data = data;
                this.prev = null;
                this.next = null;
            }
            LinkedList.prototype.addChild = function (node) {
                var oldnext = this.next;
                this.next = node;
                this.next.next = oldnext;
                this.next.prev = this;
                if (oldnext !== null)
                    oldnext.prev = this.next;
            };
            LinkedList.prototype.removeChild = function () {
                if (this.next !== null) {
                    var removed = this.next;
                    this.next = this.next.next;
                    if (this.next != null)
                        this.next.prev = this;
                }
            };
            return LinkedList;
        }());
        dataStructures.LinkedList = LinkedList;
    })(dataStructures = renderPro.dataStructures || (renderPro.dataStructures = {}));
})(renderPro || (renderPro = {}));
