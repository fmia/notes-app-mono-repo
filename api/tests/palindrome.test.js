const { palindrome } = require('../utils/for_testing')

test('Palindrome of midudev', () => {
    const result = palindrome('midudev')

    expect(result).toBe('vedudim')
})

test('palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
})

test('palindrome of undefined value', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})