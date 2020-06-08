import React from 'react';
import { Caption } from 'react-native-paper';
import styled from 'styled-components/native';

const TableRoot = styled.View`
    display: flex;
    flex-direction: column;
`;

const TableRow = styled.View`
    display: flex;
    flex-direction: row;
    border-top-width: 1px;
    border-bottom-width: ${({ isLastRow }) => isLastRow ? 1 : 0}px;
    border-color: ${({ tableStyle: { borderColor } }) => borderColor};
`;

const TableCell = styled.View`
    flex: 1;
    padding: 5px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-right-width: ${({ isLastCell }) => isLastCell ? 0 : 1}px;
    border-color: ${({ tableStyle: { borderColor } }) => borderColor};
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

export const FlexTable = ({ columns, rows, tableStyle }) => {
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
                    {columns.map(({ key, value }, index) => (
                        <TableCell
                            key={key}
                            isLastCell={index === columns.length - 1}
                            tableStyle={style}
                        >
                            <TableCellValue>{value}</TableCellValue>
                        </TableCell>
                    ))}
                </TableRow>
            )}
            {rows.map(({ key, cells }, index) => (
                <TableRow
                    key={key}
                    isLastRow={index === rows.length - 1}
                    tableStyle={style}
                >
                    {cells.map(({ key, title, value }, index) => (
                        <TableCell
                            key={key}
                            isLastCell={index === cells.length - 1}
                            tableStyle={style}
                        >
                            {!!title && (
                                <TableCellTitle>{title}</TableCellTitle>
                            )}
                            <TableCellValue
                                hasTopMargin={!!title}
                            >
                                {value}
                            </TableCellValue>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableRoot>
    );
};
