define(['backbone', 'js/models/xblock_info'],
    function(Backbone, XBlockInfo) { 
        describe('XblockInfo isEditable', function() {
            it('works correct', function() {
                expect(new XBlockInfo({'category': 'chapter'}).isEditable()).toBe(true);
                expect(new XBlockInfo({'category': 'course'}).isEditable()).toBe(false);
                expect(new XBlockInfo({'category': 'sequential'}).isEditable()).toBe(true);
                expect(new XBlockInfo({'category': 'vertical'}).isEditable()).toBe(false);
            });
        });
    }
);
