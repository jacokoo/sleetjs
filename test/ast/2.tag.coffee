{expect} = require 'chai'
{parse} = require '../../lib/parser'

describe 'Tag AST', ->

    describe 'Empty input', ->

        it 'should be empty', ->
            expect(parse('').tags).to.be.empty
            expect(parse('     ').tags).to.be.empty
            expect(parse('  \n \n  \n   ').tags).to.be.empty

    describe 'Basic properties', ->

        it 'should match default value', ->
            tag = parse('a').tags[0]
            expect(tag.name).to.equal('a')
            expect(tag.hash).to.be.null
            expect(tag.dot).to.be.empty
            expect(tag.indent).to.equal(0)
            expect(tag.attributeGroups).to.be.empty
            expect(tag.children).to.be.empty
            expect(tag.isInlineChild).to.be.undefined
            expect(tag.isInlineSibling).be.be.undefined

        it 'should have dot and hash property', ->
            tag = parse('a#id').tags[0]
            expect(tag.hash).to.equal 'id'
            tag = parse('a.c1.c2').tags[0]
            expect(tag.dot).to.have.length(2).and.to.deep.equal(['c1', 'c2'])
            tag = parse('a.c1#id.c2.c3').tags[0]
            expect(tag.hash).to.equal 'id'
            expect(tag.dot).to.have.length(3).and.to.deep.equal(['c1', 'c2', 'c3'])

    describe 'Inline tags', ->

        it 'inline children', ->
            tags = parse('a: b :c>d').tags
            expect(tags).to.have.length(1)

            parent = tags[0]
            expect(parent.name).to.equal('a')
            expect(parent.children).to.have.length(1)
            expect(parent.haveInlineChild).to.be.true
            child = parent.children[0]
            expect(child.name).to.equal('b')
            expect(child.indent).to.equal(parent.indent).and.to.equal(0)
            expect(child.isInlineChild).to.be.true

            parent = child
            expect(parent.children).to.have.length(1)
            expect(parent.haveInlineChild).to.be.true
            child = child.children[0]
            expect(child.name).to.equal('c')
            expect(child.indent).to.equal(parent.indent).and.to.equal(0)
            expect(child.isInlineChild).to.be.true

            parent = child
            expect(parent.children).to.have.length(1)
            expect(parent.haveInlineChild).to.be.true
            child = child.children[0]
            expect(child.name).to.equal('d')
            expect(child.indent).to.equal(parent.indent).and.to.equal(0)
            expect(child.isInlineChild).to.be.true

            expect(child.children).to.be.empty
            expect(child.haveInlineChild).to.be.undefined

        it 'inline siblings', ->
            tags = parse('a+b +c + d').tags
            expect(tags).have.length(4)
            [a, b, c, d] = tags
            expect(a.name).to.equal('a')
            expect(b.name).to.equal('b')
            expect(c.name).to.equal('c')
            expect(d.name).to.equal('d')
            expect(a.indent).to.equal(b.indent).and.equal(c.indent).and.equal(d.indent).and.equal(0)

            expect(a.isInlineSibling).to.be.undefined
            expect(b.isInlineSibling).to.be.true
            expect(c.isInlineSibling).to.be.true
            expect(d.isInlineSibling).to.be.true

        it 'mix inline children and inline siblings', ->
            tags = parse('a > b + c + d > e').tags
            expect(tags).have.length(1)
            a = tags[0]
            expect(a.name).to.equal('a')
            expect(a.children).have.length(3)
            expect(a.haveInlineChild).to.be.true

            [b, c, d] = a.children
            expect(b.name).to.equal('b')
            expect(c.name).to.equal('c')
            expect(d.name).to.equal('d')

            expect(b.children).to.be.empty
            expect(b.haveInlineChild).to.be.undefined
            expect(b.isInlineSibling).to.be.undefined

            expect(c.children).to.be.empty
            expect(c.haveInlineChild).to.be.undefined
            expect(c.isInlineSibling).to.be.true

            expect(d.children).have.length 1
            expect(d.haveInlineChild).to.be.true
            expect(d.isInlineSibling).to.be.true

            [e] = d.children
            expect(e.children).to.be.empty
            expect(e.haveInlineChild).to.be.undefined
            expect(e.isInlineSibling).to.be.undefined
            expect(e.isInlineChild).to.be.true

    describe 'Indentation', ->
