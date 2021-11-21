import React, { useState } from 'react';
import map from 'lodash/map';
import {
    Caption,
    IconButton,
    useTheme,
    Menu
} from 'react-native-paper';
import styled from 'styled-components/native';

const TableRoot = styled.View`
    display: flex;
    flex-direction: column;
`;

const TableRow = styled.View`
    display: flex;
    flex-direction: row;
`;

const TableCell = styled.View`
    ${({ isActionCell }) => isActionCell ? '' : 'flex: 1'}; 
    padding: 5px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-right-width: ${({ isLastCell }) => isLastCell ? 0 : 1}px;
    border-top-width: ${({
        isHeaderCell,
        isActionCell
    }) => (!isHeaderCell || isActionCell) ? 0 : 1}px;
    border-bottom-width: ${({ shouldDisplay }) => shouldDisplay ? 1 : 0}px;
    border-color: ${({ tableStyle: { borderColor } }) => borderColor};
    justify-content: center;
`;

const TableCellTitle = styled(Caption)`
    margin: 0;
    text-align: center;
`;

const TableCellValue = styled.Text`
    margin-top: ${({ hasTopMargin }) => hasTopMargin ? 5 : 0}px;
    text-align: center;
    font-weight: bold;
`;

const defaultTableStyle = {
    borderColor: 'black'
};

const ActionsCell = ({
    row,
    getRowActions,
    isLastRow,
    tableStyle
}) => {
    const theme = useTheme();
    const [isActionsMenuVisible, setIsActionsMenuVisible] = useState(false);

    if (!getRowActions) {
        return null;
    }

    const { shouldDisplay = true, actions } = getRowActions(row);

    const renderCell = content => (
        <TableCell
            shouldDisplay={shouldDisplay}
            isLastCell
            isLastRow={isLastRow}
            isActionCell
            tableStyle={tableStyle}
        >
            {content}
        </TableCell>
    );

    if (!shouldDisplay) {
        return renderCell(
            <IconButton />
        );
    }

    if (actions.length === 1) {
        const { onPress, getIcon } = actions[0];
        const handleOnPress = () => onPress(row);
        return renderCell(
            <IconButton
                onPress={handleOnPress}
                icon={getIcon(row)}
                color={theme.colors.primary}
            />
        );
    }

    const showActionsMenu = () => {
        setIsActionsMenuVisible(true);
    };

    const hideActionsMenu = () => {
        setIsActionsMenuVisible(false);
    };

    const menu = (
        <Menu
            visible={isActionsMenuVisible}
            onDismiss={hideActionsMenu}
            anchor={(
                <IconButton
                    color={theme.colors.primary}
                    icon='menu-down-outline'
                    onPress={showActionsMenu}
                />
            )}
        >
            {
                map(
                    actions,
                    ({ key, onPress, getTitle }) => {
                        const handleOnPress = () => {
                            hideActionsMenu();
                            onPress(row);
                        };
                        return (
                            <Menu.Item
                                key={key}
                                onPress={handleOnPress}
                                title={getTitle(row)}
                            />
                        );
                    }
                )
            }
        </Menu>
    );

    return renderCell(menu);
};

export const FlexTable = ({
    columns,
    rows,
    getRowActions,
    tableStyle
}) => {
    const style = {
        ...defaultTableStyle,
        ...tableStyle
    };

    return (
        <TableRoot>
            {!!columns && (
                <TableRow
                    tableStyle={style}
                >
                    {map(
                        columns,
                        ({ key, value }, index) => (
                            <TableCell
                                key={key}
                                shouldDisplay
                                isHeaderCell
                                isLastCell={index === columns.length - 1 && !getRowActions}
                                tableStyle={style}
                            >
                                <TableCellValue>{value}</TableCellValue>
                            </TableCell>
                        )
                    )}
                    {!!getRowActions && (
                        <TableCell
                            shouldDisplay
                            isLastCell
                            isActionCell
                            isHeaderCell
                            tableStyle={style}
                        >
                            <IconButton />
                        </TableCell>
                    )}
                </TableRow>
            )}
            {map(
                rows,
                (row, index) => {
                    const { key, cells } = row;
                    return (
                        <TableRow
                            key={key}
                            tableStyle={style}
                        >
                            {map(
                                cells,
                                ({
                                    key,
                                    shouldDisplay = true,
                                    title,
                                    value,
                                    renderCell
                                }, index) => {
                                    const cellContent = !shouldDisplay ?
                                        null :
                                        renderCell ?
                                            renderCell(row) : (
                                                <>
                                                    {!!title && (
                                                        <TableCellTitle>{title}</TableCellTitle>
                                                    )}
                                                    <TableCellValue
                                                        hasTopMargin={!!title}
                                                    >
                                                        {value}
                                                    </TableCellValue>
                                                </>
                                            );
                                    return (
                                        <TableCell
                                            key={key}
                                            shouldDisplay={shouldDisplay}
                                            isLastCell={
                                                index === cells.length - 1 && !getRowActions
                                            }
                                            isLastRow={index === rows.length - 1}
                                            tableStyle={style}
                                        >
                                            {cellContent}
                                        </TableCell>
                                    );
                                }
                            )}
                            <ActionsCell
                                row={row}
                                isLastRow={index === rows.length - 1}
                                getRowActions={getRowActions}
                                tableStyle={style}
                            />
                        </TableRow>
                    );
                }
            )}
        </TableRoot>
    );
};
