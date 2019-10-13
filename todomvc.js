
jb.ns("todomvc")
jb.component('todo', { /* todo */
  watchableData: [
  ]
})

jb.component('filterBy', { /* filterBy */
  watchableData: 'all'
})

jb.component('todomvc.main', { /* todomvc.main */
  type: 'control',
  impl: group({
    controls: [
      label({title: 'todos', style: label.htmlTag('h1', 'headline')}),
      group({
        title: 'header',
        style: layout.horizontal('3'),
        controls: [
          editableBoolean({
            databind: isEmpty(todomvc.filterCompleted('false')),
            style: editableBoolean.checkboxWithLabel(),
            title: 'toggle all',
            textForTrue: '❯',
            textForFalse: '❯',
            features: [
              css('{transform: rotate(90deg)}'),
              css.class('toggle-all'),
              hidden(notEmpty('%$todo%')),
              watchRef({ref: '%$todo%', includeChildren: 'yes', allowSelfRefresh: true}),
              feature.onEvent({
                event: 'change',
                action: action.switch(
                  [
                    {
                      condition: isEmpty(todomvc.filterCompleted('false')),
                      action: runActionOnItems('%$todo%', toggleBooleanValue('%completed%'))
                    },
                    {
                      condition: 'true',
                      action: runActionOnItems(
                        todomvc.filterCompleted('false'),
                        toggleBooleanValue('%completed%')
                      )
                    }
                  ]
                )
              })
            ]
          }),
          editableText({
            title: 'input',
            databind: '%$input%',
            style: editableText.input(),
            features: [
              css.class('new-todo'),
              feature.onEnter(
                action.if(
                    '%$input%',
                    runActions(
                      addToArray(
                          '%$todo%',
                          obj(prop('task', '%$input%', 'string'), prop('completed', undefined, 'boolean'))
                        ),
                      writeValue('%$input%')
                    )
                  )
              ),
              htmlAttribute('placeholder', 'What needs to be done?')
            ]
          })
        ]
      }),
      group({
        title: 'main',
        controls: [
          itemlist({
            title: 'todo-list',
            items: pipeline(
              '%$todo%',
              If(
                  or(
                    equals('%$filterBy%', 'all'),
                    and(equals('%$filterBy%', 'completed'), '%completed%'),
                    and(equals('%$filterBy%', 'active'), not('%completed%'))
                  ),
                  '%%',
                  null
                )
            ),
            controls: [
              group({
                title: 'item',
                style: layout.horizontal(3),
                controls: [
                  editableBoolean({
                    databind: '%completed%',
                    style: editableBoolean.checkbox(),
                    title: 'toggle',
                    textForTrue: 'yes',
                    textForFalse: 'no',
                    features: [css.class('toggle'), hidden(not('%$editableline%')), watchRef('%$editableline%')]
                  }),
                  editableText({
                    title: 'task',
                    databind: '%task%',
                    style: editableText.expandable({
                      buttonFeatures: css.class('task'),
                      editableFeatures: css.class('edit'),
                      onToggle: toggleBooleanValue('%$editableline%')
                    }),
                    features: [css('{width: 100%}'), css.class('editable-text')]
                  }),
                  button({
                    title: 'delete',
                    action: splice({
                      array: '%$todo%',
                      fromIndex: indexOf('%$todo%', '%%'),
                      noOfItemsToRemove: '1'
                    }),
                    style: button.native(),
                    features: [
                      css.class('destroy'),
                      hidden(not('%$editableline%')),
                      watchRef('%$editableline%')
                    ]
                  })
                ],
                features: [
                  variable({name: 'editableline', watchable: true}),
                  conditionalClass('completed', '%completed%')
                ]
              })
            ],
            style: itemlist.ulLi(),
            itemVariable: 'item',
            features: [
              css.class('todo-list'),
              watchRef({ref: '%$filterBy%', allowSelfRefresh: true}),
              watchRef({ref: '%$todo%', includeChildren: 'yes', allowSelfRefresh: true})
            ]
          })
        ],
        features: css.class('main')
      }),
      group({
        title: 'toolbar',
        style: group.htmlTag('footer'),
        controls: [
          label({
            title: pipeline(
              count(todomvc.filterCompleted('false')),
              '%% ',
              data.if('%% > 1', '%% items', '%% item'),
              '%% left'
            ),
            style: label.span(),
            features: [
              field.title('items left'),
              watchRef({ref: '%$todo%', includeChildren: 'yes'}),
              css.class('todo-count')
            ]
          }),
          group({
            title: 'filters',
            style: group.ulLi(),
            controls: [
              button({
                title: 'All',
                action: writeValue('%$filterBy%', 'all'),
                style: button.href(),
                features: conditionalClass('selected', equals('all', '%$filterBy%'))
              }),
              button({
                title: 'Active',
                action: writeValue('%$filterBy%', 'active'),
                style: button.href(),
                features: conditionalClass('selected', equals('active', '%$filterBy%'))
              }),
              button({
                title: 'Completed',
                action: writeValue('%$filterBy%', 'completed'),
                style: button.href(),
                features: conditionalClass('selected', equals('completed', '%$filterBy%'))
              })
            ],
            features: [css.class('filters'), watchRef({ref: '%$filterBy%', allowSelfRefresh: true})]
          }),
          button({
            title: 'Clear completed',
            action: runActionOnItems(
              todomvc.filterCompleted(),
              removeFromArray({array: '%$todo%', itemToRemove: '%%'})
            ),
            style: button.href(),
            features: [
              css.class('clear-completed'),
              hidden(notEmpty(todomvc.filterCompleted())),
              watchRef({ref: '%$todo%', includeChildren: 'yes', allowSelfRefresh: true})
            ]
          })
        ],
        features: css.class('footer')
      })
    ],
    features: [css.class('todoapp')]
  })
})

jb.component('todomvc.filter-completed',{
  params: [{ id: 'filterby', as: 'boolean', description: 'filter completed by true or false' ,defaultValue: true }],
  impl: pipeline('%$todo%', filter(equals('%completed%','%$filterby%')))
})



jb.component('input', { /* input */
  watchableData: ''
})









