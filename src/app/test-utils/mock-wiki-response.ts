export const getWikiResponse = () => ({
  batchComplete: true,
  query: {
    search: [{
      ns: 0,
      pageid: 1,
      snippet: '<span>This</span> is a snippet for the page',
      title: 'Title of the page',
    }],
  },
});