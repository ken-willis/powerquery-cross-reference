// src/parserIntegration.ts
// PQ Workspace DevKit - Microsoft Parser Integration
// Uses official Power Query parser for accurate symbol extraction

import * as PQP from '@microsoft/powerquery-parser';
import { PowerQuerySymbol, PowerQueryFile } from './fileScanner';

export class PowerQueryParser {
    /**
     * Parse Power Query text and extract exported symbols
     */
    public async parseAndExtractSymbols(
        content: string,
        file: PowerQueryFile
    ): Promise<PowerQuerySymbol[]> {
        const symbols: PowerQuerySymbol[] = [];

        try {
            // Parse using Microsoft's parser
            const parseResult = PQP.TaskUtils.tryLexParse(
                PQP.DefaultSettings,
                content,
                PQP.Parser.IParserState.newInstance()
            );

            if (parseResult.kind === PQP.ResultKind.Err) {
                console.error(`Parse error in ${file.fileName}:`, parseResult.error);
                return symbols;
            }

            const ast = parseResult.value.root;

            // Extract symbols based on AST node type
            if (ast.kind === PQP.Language.Ast.NodeKind.Section) {
                // Handle section members
                symbols.push(...this.extractSectionSymbols(ast as PQP.Language.Ast.Section, file));
            } else if (ast.kind === PQP.Language.Ast.NodeKind.LetExpression) {
                // Handle let...in expression - only export the return value
                symbols.push(
                    ...this.extractLetExpressionSymbols(ast as PQP.Language.Ast.LetExpression, file)
                );
            }
        } catch (error) {
            console.error(`Failed to parse ${file.fileName}:`, error);
        }

        return symbols;
    }

    /**
     * Extract symbols from a section (only shared members are exported)
     */
    private extractSectionSymbols(
        section: PQP.Language.Ast.Section,
        file: PowerQueryFile
    ): PowerQuerySymbol[] {
        const symbols: PowerQuerySymbol[] = [];

        // Iterate through section members
        for (const member of section.sectionMembers.elements) {
            const sectionMember = member.sectionMember;

            // Only export 'shared' members
            if (sectionMember.sharedConstant) {
                const name = sectionMember.namePairedExpression.key.literal;
                const expression = sectionMember.namePairedExpression.value;

                const symbol: PowerQuerySymbol = {
                    name: name,
                    type: this.inferSymbolType(expression),
                    file: file,
                    line: this.getLineNumber(sectionMember),
                    documentation: this.extractDocumentation(sectionMember),
                };

                // Add function parameters if applicable
                if (expression.kind === PQP.Language.Ast.NodeKind.FunctionExpression) {
                    symbol.parameters = this.extractFunctionParameters(
                        expression as PQP.Language.Ast.FunctionExpression
                    );
                }

                // Add record fields if applicable
                if (expression.kind === PQP.Language.Ast.NodeKind.RecordExpression) {
                    symbol.fields = this.extractRecordFields(
                        expression as PQP.Language.Ast.RecordExpression
                    );
                }

                symbols.push(symbol);
            }
        }

        return symbols;
    }

    /**
     * Extract symbols from let expression (only the return value)
     */
    private extractLetExpressionSymbols(
        letExpr: PQP.Language.Ast.LetExpression,
        file: PowerQueryFile
    ): PowerQuerySymbol[] {
        const symbols: PowerQuerySymbol[] = [];

        // The 'in' expression is what gets exported
        const returnExpr = letExpr.expression;

        // If return value is a record, export its fields as accessible symbols
        if (returnExpr.kind === PQP.Language.Ast.NodeKind.RecordExpression) {
            const recordExpr = returnExpr as PQP.Language.Ast.RecordExpression;

            for (const field of recordExpr.content.elements) {
                const fieldName = field.keyValuePair.key.literal;
                const fieldValue = field.keyValuePair.value;

                symbols.push({
                    name: fieldName,
                    type: this.inferSymbolType(fieldValue),
                    file: file,
                    line: this.getLineNumber(field),
                    documentation: `Exported from ${file.fileName}`,
                });
            }
        }
        // If it's a single value, create one symbol for the file
        else {
            symbols.push({
                name: file.fileName.replace(/\.(pq|m|pqm)$/i, ''),
                type: this.inferSymbolType(returnExpr),
                file: file,
                line: 1,
                documentation: 'Module export',
            });
        }

        return symbols;
    }

    /**
     * Infer symbol type from AST expression
     */
    private inferSymbolType(
        expr: PQP.Language.Ast.TExpression
    ): 'function' | 'variable' | 'record' {
        switch (expr.kind) {
            case PQP.Language.Ast.NodeKind.FunctionExpression:
                return 'function';
            case PQP.Language.Ast.NodeKind.RecordExpression:
                return 'record';
            default:
                return 'variable';
        }
    }

    /**
     * Extract function parameters from AST
     */
    private extractFunctionParameters(
        func: PQP.Language.Ast.FunctionExpression
    ): Array<{
        name: string;
        type: string;
        isRequired: boolean;
        isNullable: boolean;
        description?: string;
    }> {
        const params: Array<{
            name: string;
            type: string;
            isRequired: boolean;
            isNullable: boolean;
        }> = [];

        // Extract parameters from the function's parameter list
        for (const param of func.parameters.elements) {
            const parameter = param.parameter;
            const paramName = parameter.name.literal;

            // Extract type if available
            let paramType = 'any';
            if (parameter.parameterType) {
                paramType = this.extractTypeName(parameter.parameterType);
            }

            params.push({
                name: paramName,
                type: paramType,
                isRequired: !parameter.optionalConstant,
                isNullable:
                    parameter.parameterType?.kind === PQP.Language.Ast.NodeKind.NullableType,
            });
        }

        return params;
    }

    /**
     * Extract type name from type AST
     */
    private extractTypeName(typeExpr: PQP.Language.Ast.TType): string {
        // Simplified - expand based on AST structure
        if (typeExpr.kind === PQP.Language.Ast.NodeKind.PrimitiveType) {
            const primitive = typeExpr as PQP.Language.Ast.PrimitiveType;
            return primitive.primitiveType.literal;
        }

        return 'any';
    }

    /**
     * Extract record fields from AST
     */
    private extractRecordFields(
        record: PQP.Language.Ast.RecordExpression
    ): Array<{ name: string; type: string; description?: string }> | undefined {
        if (record.content.elements.length === 0) {
            return undefined;
        }

        const fields: Array<{ name: string; type: string; description?: string }> = [];

        for (const element of record.content.elements) {
            const field = element.keyValuePair;
            fields.push({
                name: field.key.literal,
                type: this.inferValueType(field.value),
                description: undefined, // Could extract from comments
            });
        }

        return fields;
    }

    /**
     * Infer type from value expression
     */
    private inferValueType(expr: PQP.Language.Ast.TExpression): string {
        switch (expr.kind) {
            case PQP.Language.Ast.NodeKind.LiteralExpression:
                const literal = expr as PQP.Language.Ast.LiteralExpression;
                switch (literal.literalKind) {
                    case PQP.Language.Ast.LiteralKind.Numeric:
                        return 'number';
                    case PQP.Language.Ast.LiteralKind.Text:
                        return 'text';
                    case PQP.Language.Ast.LiteralKind.Logical:
                        return 'logical';
                    default:
                        return 'any';
                }
            case PQP.Language.Ast.NodeKind.RecordExpression:
                return 'record';
            case PQP.Language.Ast.NodeKind.ListExpression:
                return 'list';
            case PQP.Language.Ast.NodeKind.FunctionExpression:
                return 'function';
            default:
                return 'any';
        }
    }

    /**
     * Get line number from AST node
     */
    private getLineNumber(node: any): number {
        // Access token range for position info
        if (node.tokenRange) {
            return node.tokenRange.positionStart.lineNumber;
        }
        return 1;
    }

    /**
     * Extract documentation from comments
     */
    private extractDocumentation(node: any): string | undefined {
        // TODO: Parse leading comments from token stream
        return undefined;
    }
}
