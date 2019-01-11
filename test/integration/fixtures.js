const input = `test AND 3.5 AND 3 AND true AND !false OR (>3 OR <5) AND >=3.5 AND <=5 AND =6 AND "6 AND 7"`;
const responseBody = {
  output: {
    $or: [
      {
        $and: [
          { $and: [{ $and: [{ $and: ["test", 3.5] }, 3] }, true] },
          { $not: false },
        ],
      },
      {
        $and: [
          {
            $and: [
              {
                $and: [
                  {
                    $and: [
                      {
                        $or: [{ $gt: 3 }, { $lt: 5 }],
                      },
                      { $ge: 3.5 },
                    ],
                  },
                  { $le: 5 },
                ],
              },
              { $eq: 6 },
            ],
          },
          { $quoted: "6 AND 7" },
        ],
      },
    ],
  },
};

module.exports = { input, responseBody };
