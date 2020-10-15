import React from 'react';
import s from '@sanity/desk-tool/structure-builder'

//build custom sidebar
export default function Sidebar() {
    return s.list().title(`Slick's Slices`).items([
        //create a new sub item
        s.listItem()
            .title(`Home Page`)
            .icon(() => <strong>🔥</strong>)
            .child(
                s.editor()
                    .schemaType('storeSettings')
                    //make new doc id so we don't have a random string
                    .documentId('downtown')
            ),
            //add the rest of doc items
            ...s.documentTypeListItems().filter(item => item.getId() !== 'storeSettings'),
    ])
}