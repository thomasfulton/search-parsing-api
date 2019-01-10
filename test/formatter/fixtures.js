// We use this deep tree because we want to test the recursive nature of the formatter.

const input = {
  type: "AND",
  children: [
    { type: "FLOAT", value: 3.5 },
    {
      type: "OR",
      children: [
        { type: "INT", value: 4 },
        {
          type: "AND",
          children: [
            { type: "QUOTED", value: "test AND test" },
            {
              type: "AND",
              children: [
                { type: "BOOLEAN", value: true },
                {
                  type: "AND",
                  children: [
                    { type: "STRING", value: "test1" },
                    {
                      type: "AND",
                      children: [
                        { type: "EQ", value: 3 },
                        {
                          type: "AND",
                          children: [
                            { type: "LENGTH", value: 4 },
                            {
                              type: "AND",
                              children: [
                                { type: "LT", value: 5.5 },
                                {
                                  type: "AND",
                                  children: [
                                    { type: "GT", value: 6 },
                                    {
                                      type: "AND",
                                      children: [
                                        {
                                          type: "LE",
                                          value: 7.5,
                                        },
                                        {
                                          type: "AND",
                                          children: [
                                            { type: "GE", value: 8 },
                                            { type: "NOT", value: false },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const output = {
  $and: [
    3.5,
    {
      $or: [
        4,
        {
          $and: [
            { $quoted: "test AND test" },
            {
              $and: [
                true,
                {
                  $and: [
                    "test1",
                    {
                      $and: [
                        { $eq: 3 },
                        {
                          $and: [
                            { $length: 4 },
                            {
                              $and: [
                                { $lt: 5.5 },
                                {
                                  $and: [
                                    { $gt: 6 },
                                    {
                                      $and: [
                                        { $le: 7.5 },
                                        { $and: [{ $ge: 8 }, { $not: false }] },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

module.exports = {
  input,
  output,
};
