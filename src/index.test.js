import React, { useState } from 'react';
import { shallow } from 'enzyme';
import {
    Menu,
    IconButton,
    Provider as PaperProvider
} from 'react-native-paper';
import noop from 'lodash/noop';
import constant from 'lodash/constant';
import { FlexTable } from './index';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

const renderComponent = props => (
    <PaperProvider>
        <FlexTable {...props} />
    </PaperProvider>
);

const defaultProps = {
    columns: [
        {
            key: 'col1',
            value: 'Column 1'
        },
        {
            key: 'col2',
            value: 'Column 2'
        }
    ],
    rows: [
        {
            key: 'row1',
            cells: [
                {
                    key: 'row1_cell1',
                    value: 'Row 1 Cell 1'
                },
                {
                    key: 'row1_cell2',
                    value: 'Row 1 Cell 2'
                }
            ]
        },
        {
            key: 'row2',
            cells: [
                {
                    key: 'row2_cell1',
                    value: 'Row 2 Cell 1'
                },
                {
                    key: 'row2_cell2',
                    value: 'Row 2 Cell 2'
                }
            ]
        },
        {
            key: 'row3',
            cells: [
                {
                    key: 'row3_cell1',
                    value: 'Row 3 Cell 1'
                },
                {
                    key: 'row3_cell2',
                    value: 'Row 3 Cell 2'
                }
            ]
        }
    ]
};

describe('FlexTable', () => {
    const mockUseState = ({
        isActionsMenuVisible = false,
        setIsActionsMenuVisible = noop
    }) => {
        useState.mockReturnValue([
            isActionsMenuVisible,
            setIsActionsMenuVisible
        ]);
    };

    beforeEach(() => {
        mockUseState({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Without actions', () => {
        it('should render as expected', () => {
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(defaultProps))
                .find(FlexTable)
                .dive();

            expect(wrapper).toMatchSnapshot();
            // eslint-disable-next-line lodash/prefer-lodash-method
            wrapper.find('ActionsCell').forEach(actionCell => {
                expect(actionCell.dive()).toMatchSnapshot();
            });
        });
    });

    describe('With actions', () => {
        const handleOnPress = jest.fn();
        const props = {
            ...defaultProps,
            rows: [
                ...defaultProps.rows,
                {
                    key: 'row4',
                    cells: [
                        {
                            key: 'row4_cell1',
                            value: 'Row 4 Cell 1',
                            shouldDisplay: false
                        },
                        {
                            key: 'row4_cell2',
                            value: 'Row 4 Cell 2'
                        }
                    ]
                }
            ],
            getRowActions: row => ({
                actions: [
                    {
                        key: 'alert',
                        getIcon: () => row.key === 'row1' ? 'account' : 'account-alert',
                        getTitle: constant('Row 3 Action 1'),
                        onPress: () => handleOnPress(row)
                    },
                    ...(row.key !== 'row3' ? [] : [
                        {
                            key: 'alert',
                            getIcon: constant('account-alert-outline'),
                            getTitle: constant('Row 3 Action 2'),
                            onPress: () => handleOnPress(row)
                        }
                    ])
                ],
                shouldDisplay: row.key !== 'row4'
            })
        };

        it('should render as expected', () => {
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(props))
                .find(FlexTable)
                .dive();

            expect(wrapper).toMatchSnapshot();
            // eslint-disable-next-line lodash/prefer-lodash-method
            wrapper.find('ActionsCell').forEach(actionCell => {
                expect(actionCell.dive()).toMatchSnapshot();
            });
        });

        it('should call row single action onPress', () => {
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(props))
                .find(FlexTable)
                .dive();
            // eslint-disable-next-line lodash/prefer-lodash-method
            wrapper.find('ActionsCell').forEach((actionCell, index) => {
                // eslint-disable-next-line lodash/prefer-lodash-method
                index < 2 && actionCell.dive().find(IconButton).props().onPress();
            });

            expect(handleOnPress).toHaveBeenCalledTimes(2);
            expect(handleOnPress).toHaveBeenNthCalledWith(1, props.rows[0]);
            expect(handleOnPress).toHaveBeenNthCalledWith(2, props.rows[1]);
        });

        it('should have menu visible when state is true', () => {
            mockUseState({ isActionsMenuVisible: true });
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(props))
                .find(FlexTable)
                .dive();

            // eslint-disable-next-line lodash/prefer-lodash-method
            const isVisible = wrapper.find('ActionsCell')
                .at(2)
                .dive()
                .find(Menu)
                .prop('visible');

            expect(isVisible).toBe(true);
        });

        it('should call action to open menu when multiaction is clicked', () => {
            const setIsActionsMenuVisible = jest.fn();
            mockUseState({ setIsActionsMenuVisible });
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(props))
                .find(FlexTable)
                .dive();

            shallow(
                // eslint-disable-next-line lodash/prefer-lodash-method
                wrapper.find('ActionsCell')
                    .at(2)
                    .dive()
                    .find(Menu)
                    .prop('anchor')
            ).props().onPress();

            expect(handleOnPress).not.toHaveBeenCalled();
            expect(setIsActionsMenuVisible).toHaveBeenCalledTimes(1);
            expect(setIsActionsMenuVisible).toHaveBeenCalledWith(true);
        });

        it('should call actions onPress on multiaction row', () => {
            const setIsActionsMenuVisible = jest.fn();
            mockUseState({ setIsActionsMenuVisible });
            // eslint-disable-next-line lodash/prefer-lodash-method
            const wrapper = shallow(renderComponent(props))
                .find(FlexTable)
                .dive();

            // eslint-disable-next-line lodash/prefer-lodash-method
            wrapper.find('ActionsCell')
                .at(2)
                .dive()
                .find(Menu.Item)
                .forEach(item => item.props().onPress());

            expect(handleOnPress).toHaveBeenCalledTimes(2);
            expect(handleOnPress).toHaveBeenNthCalledWith(1, props.rows[2]);
            expect(handleOnPress).toHaveBeenNthCalledWith(2, props.rows[2]);
        });
    });
});
