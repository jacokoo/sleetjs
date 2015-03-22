{expect} = require 'chai'
{parse} = require '../../lib/parser'

describe 'PEG basic rules', ->

    describe 'Identifier', ->

        it 'should allow those start characters', ->
            expect(parse('@').tags[0].name).to.equal('@')
            expect(parse('$').tags[0].name).to.equal('$')
            expect(parse('_').tags[0].name).to.equal('_')
            expect(parse('a').tags[0].name).to.equal('a')
            expect(parse('A').tags[0].name).to.equal('A')

        it 'should allow those following characters', ->
            expect(parse('@0').tags[0].name).to.equal('@0')
            expect(parse('@a').tags[0].name).to.equal('@a')
            expect(parse('@A').tags[0].name).to.equal('@A')
            expect(parse('@$').tags[0].name).to.equal('@$')
            expect(parse('@_').tags[0].name).to.equal('@_')
            expect(parse('@-').tags[0].name).to.equal('@-')
            expect(parse('@0aA$_-').tags[0].name).to.equal('@0aA$_-')

    describe 'Indent token', ->

        it 'should be null', ->
            expect(parse('a').indent).to.be.null

        it 'should be \\t', ->
            expect(parse('\ta').indent).to.equal('\t')
            expect(parse('a\n\tb').indent).to.equal('\t')
            expect(parse('a\n\t\tb').indent).to.equal('\t')

        it 'should be " "', ->
            expect(parse(' a').indent).to.equal(' ')
            expect(parse('  a').indent).to.equal('  ')
            expect(parse('   a').indent).to.equal('   ')
            expect(parse('a\n b').indent).to.equal(' ')
            expect(parse('a\n  b').indent).to.equal('  ')
            expect(parse('a\n   b').indent).to.equal('   ')

    describe 'Quoted string', ->

        it 'should be escaped', ->
            str = parse('''
                a(a="a'\\n\0\f\\r\t\b")
            ''').tags[0].attributeGroups[0].attributes[0].value[0].value
            expect(str).to.equal('a\'\\n\0\f\\r\t\b')
            str = parse('''
                a(a='a"\\n\0\f\\r\t\b')
            ''').tags[0].attributeGroups[0].attributes[0].value[0].value
            expect(str).to.equal('a\"\\n\0\f\\r\t\b')

    describe 'Number', ->
        it 'should be numbers', ->
            inputs = [
                'a(a=0)', 'a(a=-0)', 'a(a=123)', 'a(a=-123)'
                'a(a=.0)', 'a(a=-.0)', 'a(a=0.0)', 'a(a=-0.0)'
                'a(a=.123)', 'a(a=-.123)'
                'a(a=0xa)', 'a(a=010)'
                'a(a=2e4)', 'a(a=2e+4)', 'a(a=2e-4)'
                'a(a=123.123)', 'a(a=-123.123e2)'
            ]
            values = [
                0, 0, 123, -123
                0, 0, 0, 0
                0.123, -0.123
                10, 8
                20000, 20000, 0.0002
                123.123, -12312.3
            ]

            for item, i in inputs
                value = parse(item).tags[0].attributeGroups[0].attributes[0].value[0]
                expect(value.type).to.equals('number')
                expect(value.value).to.equal(values[i])
