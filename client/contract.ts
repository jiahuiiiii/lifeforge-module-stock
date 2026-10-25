export const contract = {
  "data": {
    "getQuote": {
      "method": "get",
      "description": "Fetch a real-time quote for a stock symbol.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "symbol": {
              "type": "string"
            }
          },
          "required": [
            "symbol"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "symbol": {
              "type": "string"
            },
            "price": {
              "type": "number"
            },
            "change": {
              "type": "number"
            },
            "change_percent": {
              "type": "number"
            }
          },
          "required": [
            "symbol",
            "price",
            "change",
            "change_percent"
          ],
          "additionalProperties": false
        }
      }
    },
    "getStock": {
      "method": "get",
      "description": "Fetch daily time series data for a stock symbol.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "symbol": {
              "type": "string"
            }
          },
          "required": [
            "symbol"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "symbol": {
              "type": "string"
            },
            "last_refreshed": {
              "type": "string"
            },
            "data": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "date": {
                    "type": "string"
                  },
                  "open": {
                    "type": "number"
                  },
                  "high": {
                    "type": "number"
                  },
                  "low": {
                    "type": "number"
                  },
                  "close": {
                    "type": "number"
                  },
                  "volume": {
                    "type": "number"
                  }
                },
                "required": [
                  "date",
                  "open",
                  "high",
                  "low",
                  "close",
                  "volume"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "symbol",
            "last_refreshed",
            "data"
          ],
          "additionalProperties": false
        }
      }
    },
    "search": {
      "method": "get",
      "description": "Search stocks by symbol or company name.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "keywords": {
              "type": "string"
            }
          },
          "required": [
            "keywords"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "results": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "symbol": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "string"
                  },
                  "region": {
                    "type": "string"
                  },
                  "currency": {
                    "type": "string"
                  },
                  "exchange": {
                    "type": "string"
                  }
                },
                "required": [
                  "symbol",
                  "name",
                  "type",
                  "region",
                  "currency",
                  "exchange"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "results"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "portfolios": {
    "create": {
      "method": "post",
      "description": "Create a new portfolio.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "closing_time": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "closing_time"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "closing_time": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "closing_time"
          ],
          "additionalProperties": false
        }
      }
    },
    "getById": {
      "method": "get",
      "description": "Get a portfolio by id, including its holdings and value history.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "closing_time": {
              "type": "string",
              "format": "date-time"
            },
            "holdings": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "symbol": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "shares": {
                    "type": "number"
                  },
                  "avg_cost": {
                    "type": "number"
                  },
                  "date_added": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "portfolio": {
                    "type": "string"
                  }
                },
                "required": [
                  "id",
                  "symbol",
                  "name",
                  "shares",
                  "avg_cost",
                  "date_added",
                  "portfolio"
                ],
                "additionalProperties": false
              }
            },
            "value_history": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "portfolio": {
                    "type": "string"
                  },
                  "value": {
                    "type": "number"
                  },
                  "date": {
                    "type": "string",
                    "format": "date-time"
                  }
                },
                "required": [
                  "id",
                  "portfolio",
                  "value",
                  "date"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "id",
            "name",
            "closing_time",
            "holdings",
            "value_history"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "List all portfolios with their holding count and latest value.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "closing_time": {
                "type": "string",
                "format": "date-time"
              },
              "holding_count": {
                "type": "number"
              },
              "latest_value": {
                "type": "number"
              }
            },
            "required": [
              "id",
              "name",
              "closing_time",
              "holding_count",
              "latest_value"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Delete a portfolio.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update a portfolio.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "closing_time": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "closing_time"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "closing_time": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "name",
            "closing_time"
          ],
          "additionalProperties": false
        }
      }
    },
    "holdings": {
      "create": {
        "method": "post",
        "description": "Create a new holding entry for a portfolio.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "query": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "portfolioId": {
                "type": "string"
              }
            },
            "required": [
              "portfolioId"
            ],
            "additionalProperties": false
          },
          "body": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "symbol": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "shares": {
                "type": "number"
              },
              "avg_cost": {
                "type": "number"
              },
              "date_added": {
                "type": "string"
              }
            },
            "required": [
              "symbol",
              "name",
              "shares",
              "avg_cost",
              "date_added"
            ],
            "additionalProperties": false
          }
        },
        "output": {
          "CREATED": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "symbol": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "shares": {
                "type": "number"
              },
              "avg_cost": {
                "type": "number"
              },
              "date_added": {
                "type": "string",
                "format": "date-time"
              },
              "portfolio": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "symbol",
              "name",
              "shares",
              "avg_cost",
              "date_added",
              "portfolio"
            ],
            "additionalProperties": false
          }
        }
      },
      "remove": {
        "method": "post",
        "description": "Remove a holding entry from a portfolio.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "query": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            },
            "required": [
              "id"
            ],
            "additionalProperties": false
          }
        },
        "output": {
          "NO_CONTENT": true
        }
      },
      "update": {
        "method": "post",
        "description": "Update a holding entry for a portfolio.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "query": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              }
            },
            "required": [
              "id"
            ],
            "additionalProperties": false
          },
          "body": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "shares": {
                "type": "number"
              },
              "avg_cost": {
                "type": "number"
              },
              "date_added": {
                "type": "string"
              }
            },
            "required": [
              "shares",
              "avg_cost",
              "date_added"
            ],
            "additionalProperties": false
          }
        },
        "output": {
          "OK": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "symbol": {
                "type": "string"
              },
              "name": {
                "type": "string"
              },
              "shares": {
                "type": "number"
              },
              "avg_cost": {
                "type": "number"
              },
              "date_added": {
                "type": "string",
                "format": "date-time"
              },
              "portfolio": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "symbol",
              "name",
              "shares",
              "avg_cost",
              "date_added",
              "portfolio"
            ],
            "additionalProperties": false
          }
        }
      }
    }
  },
  "diary": {
    "create": {
      "method": "post",
      "description": "Create a new diary entry.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "image": {
          "optional": true
        }
      },
      "input": {
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "feel": {
              "type": "string",
              "enum": [
                "bullish",
                "neutral",
                "bearish",
                "anxious",
                "excited"
              ]
            },
            "title": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            }
          },
          "required": [
            "date",
            "feel",
            "title",
            "notes"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "CREATED": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "date": {
              "type": "string",
              "format": "date-time"
            },
            "feel": {
              "type": "string",
              "enum": [
                "bullish",
                "neutral",
                "bearish",
                "anxious",
                "excited"
              ]
            },
            "title": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "image": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "date",
            "feel",
            "title",
            "notes",
            "image",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
      }
    },
    "list": {
      "method": "get",
      "description": "List diary entries, newest first.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {},
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "date": {
                "type": "string",
                "format": "date-time"
              },
              "feel": {
                "type": "string",
                "enum": [
                  "bullish",
                  "neutral",
                  "bearish",
                  "anxious",
                  "excited"
                ]
              },
              "title": {
                "type": "string"
              },
              "notes": {
                "type": "string"
              },
              "image": {
                "type": "string"
              },
              "created": {
                "type": "string",
                "format": "date-time"
              },
              "updated": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": [
              "id",
              "date",
              "feel",
              "title",
              "notes",
              "image",
              "created",
              "updated"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "remove": {
      "method": "post",
      "description": "Remove a diary entry.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": null,
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "NO_CONTENT": true
      }
    },
    "update": {
      "method": "post",
      "description": "Update a diary entry.",
      "noAuth": false,
      "encrypted": true,
      "isDownloadable": false,
      "media": {
        "image": {
          "optional": true
        }
      },
      "input": {
        "query": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": [
            "id"
          ],
          "additionalProperties": false
        },
        "body": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "date": {
              "type": "string"
            },
            "feel": {
              "type": "string",
              "enum": [
                "bullish",
                "neutral",
                "bearish",
                "anxious",
                "excited"
              ]
            },
            "title": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            }
          },
          "required": [
            "date",
            "feel",
            "title",
            "notes"
          ],
          "additionalProperties": false
        }
      },
      "output": {
        "OK": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "date": {
              "type": "string",
              "format": "date-time"
            },
            "feel": {
              "type": "string",
              "enum": [
                "bullish",
                "neutral",
                "bearish",
                "anxious",
                "excited"
              ]
            },
            "title": {
              "type": "string"
            },
            "notes": {
              "type": "string"
            },
            "image": {
              "type": "string"
            },
            "created": {
              "type": "string",
              "format": "date-time"
            },
            "updated": {
              "type": "string",
              "format": "date-time"
            }
          },
          "required": [
            "id",
            "date",
            "feel",
            "title",
            "notes",
            "image",
            "created",
            "updated"
          ],
          "additionalProperties": false
        }
      }
    }
  },
  "analyzer": {
    "settings": {
      "list": {
        "method": "get",
        "description": "List all analyzer scoring settings.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {},
        "output": {
          "OK": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "properties": {
                "label": {
                  "type": "string"
                },
                "unit": {
                  "type": "string",
                  "enum": [
                    "%",
                    "x",
                    "pts"
                  ]
                },
                "is_inverse": {
                  "type": "boolean"
                },
                "tiers": {
                  "anyOf": [
                    {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "threshold": {
                            "type": "number"
                          },
                          "score": {
                            "type": "number"
                          }
                        },
                        "required": [
                          "threshold",
                          "score"
                        ],
                        "additionalProperties": false
                      }
                    },
                    {
                      "type": "object",
                      "properties": {
                        "profit_inflow": {
                          "type": "number"
                        },
                        "profit_outflow": {
                          "type": "number"
                        },
                        "loss_inflow": {
                          "type": "number"
                        },
                        "loss_outflow": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "profit_inflow",
                        "profit_outflow",
                        "loss_inflow",
                        "loss_outflow"
                      ],
                      "additionalProperties": false
                    }
                  ]
                }
              },
              "required": [
                "label",
                "unit",
                "is_inverse",
                "tiers"
              ],
              "additionalProperties": false
            }
          }
        }
      },
      "reset": {
        "method": "post",
        "description": "Reset analyzer scoring settings to defaults.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {},
        "output": {
          "OK": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "reset": {
                "type": "number"
              }
            },
            "required": [
              "reset"
            ],
            "additionalProperties": false
          }
        }
      },
      "update": {
        "method": "post",
        "description": "Update analyzer scoring settings.",
        "noAuth": false,
        "encrypted": true,
        "isDownloadable": false,
        "media": null,
        "input": {
          "body": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "settings": {
                "type": "object",
                "additionalProperties": {
                  "type": "object",
                  "properties": {
                    "label": {
                      "type": "string"
                    },
                    "unit": {
                      "type": "string",
                      "enum": [
                        "%",
                        "x",
                        "pts"
                      ]
                    },
                    "is_inverse": {
                      "type": "boolean"
                    },
                    "tiers": {
                      "anyOf": [
                        {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "threshold": {
                                "type": "number"
                              },
                              "score": {
                                "type": "number"
                              }
                            },
                            "required": [
                              "threshold",
                              "score"
                            ],
                            "additionalProperties": false
                          }
                        },
                        {
                          "type": "object",
                          "properties": {
                            "profit_inflow": {
                              "type": "number"
                            },
                            "profit_outflow": {
                              "type": "number"
                            },
                            "loss_inflow": {
                              "type": "number"
                            },
                            "loss_outflow": {
                              "type": "number"
                            }
                          },
                          "required": [
                            "profit_inflow",
                            "profit_outflow",
                            "loss_inflow",
                            "loss_outflow"
                          ],
                          "additionalProperties": false
                        }
                      ]
                    }
                  },
                  "required": [
                    "label",
                    "unit",
                    "is_inverse",
                    "tiers"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "settings"
            ],
            "additionalProperties": false
          }
        },
        "output": {
          "OK": {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
              "updated": {
                "type": "number"
              }
            },
            "required": [
              "updated"
            ],
            "additionalProperties": false
          }
        }
      }
    },
    "logs": {
      "calculator": {
        "clearAll": {
          "method": "post",
          "description": "Delete all calculator logs.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {},
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "deleted": {
                  "type": "number"
                }
              },
              "required": [
                "deleted"
              ],
              "additionalProperties": false
            }
          }
        },
        "create": {
          "method": "post",
          "description": "Create a new calculator log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "body": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "ticker": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "exchange": {
                  "type": "string"
                },
                "date": {
                  "type": "string"
                },
                "values_and_scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "properties": {
                      "value": {
                        "type": "number"
                      },
                      "score": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "score"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_score": {
                  "type": "number"
                }
              },
              "required": [
                "ticker",
                "name",
                "exchange",
                "date",
                "values_and_scores",
                "total_score"
              ],
              "additionalProperties": false
            }
          },
          "output": {
            "CREATED": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "ticker": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "exchange": {
                  "type": "string"
                },
                "date": {
                  "type": "string",
                  "format": "date-time"
                },
                "values_and_scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "properties": {
                      "value": {
                        "type": "number"
                      },
                      "score": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "score"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_score": {
                  "type": "number"
                }
              },
              "required": [
                "id",
                "ticker",
                "name",
                "exchange",
                "date",
                "values_and_scores",
                "total_score"
              ],
              "additionalProperties": false
            }
          }
        },
        "list": {
          "method": "get",
          "description": "List all calculator logs, newest first.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {},
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "ticker": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "exchange": {
                    "type": "string"
                  },
                  "date": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "values_and_scores": {
                    "type": "object",
                    "additionalProperties": {
                      "type": "object",
                      "properties": {
                        "value": {
                          "type": "number"
                        },
                        "score": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "score"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "total_score": {
                    "type": "number"
                  }
                },
                "required": [
                  "id",
                  "ticker",
                  "name",
                  "exchange",
                  "date",
                  "values_and_scores",
                  "total_score"
                ],
                "additionalProperties": false
              }
            }
          }
        },
        "remove": {
          "method": "post",
          "description": "Delete a calculator log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "query": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              },
              "required": [
                "id"
              ],
              "additionalProperties": false
            }
          },
          "output": {
            "NO_CONTENT": true
          }
        },
        "update": {
          "method": "post",
          "description": "Update a calculator log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "query": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              },
              "required": [
                "id"
              ],
              "additionalProperties": false
            },
            "body": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "ticker": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "exchange": {
                  "type": "string"
                },
                "date": {
                  "type": "string"
                },
                "values_and_scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "properties": {
                      "value": {
                        "type": "number"
                      },
                      "score": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "score"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_score": {
                  "type": "number"
                }
              },
              "additionalProperties": false
            }
          },
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "ticker": {
                  "type": "string"
                },
                "name": {
                  "type": "string"
                },
                "exchange": {
                  "type": "string"
                },
                "date": {
                  "type": "string",
                  "format": "date-time"
                },
                "values_and_scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "object",
                    "properties": {
                      "value": {
                        "type": "number"
                      },
                      "score": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "score"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_score": {
                  "type": "number"
                }
              },
              "required": [
                "id",
                "ticker",
                "name",
                "exchange",
                "date",
                "values_and_scores",
                "total_score"
              ],
              "additionalProperties": false
            }
          }
        }
      },
      "analyzer": {
        "clearAll": {
          "method": "post",
          "description": "Delete all analyzer logs.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {},
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "deleted": {
                  "type": "number"
                }
              },
              "required": [
                "deleted"
              ],
              "additionalProperties": false
            }
          }
        },
        "create": {
          "method": "post",
          "description": "Create a new analyzer log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "body": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "ticker": {
                  "type": "string"
                },
                "stock_exchange": {
                  "type": "string"
                },
                "company_name": {
                  "type": "string"
                },
                "date": {
                  "type": "string"
                },
                "values": {
                  "type": "object",
                  "additionalProperties": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "string"
                      }
                    ]
                  }
                },
                "scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "number"
                  }
                },
                "quantitative": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "boolean"
                  }
                }
              },
              "required": [
                "ticker",
                "stock_exchange",
                "company_name",
                "date",
                "values",
                "scores",
                "quantitative"
              ],
              "additionalProperties": false
            }
          },
          "output": {
            "CREATED": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "ticker": {
                  "type": "string"
                },
                "stock_exchange": {
                  "type": "string"
                },
                "company_name": {
                  "type": "string"
                },
                "date": {
                  "type": "string",
                  "format": "date-time"
                },
                "values": {
                  "type": "object",
                  "additionalProperties": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "string"
                      }
                    ]
                  }
                },
                "scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "number"
                  }
                },
                "quantitative": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "boolean"
                  }
                }
              },
              "required": [
                "id",
                "ticker",
                "stock_exchange",
                "company_name",
                "date",
                "values",
                "scores",
                "quantitative"
              ],
              "additionalProperties": false
            }
          }
        },
        "list": {
          "method": "get",
          "description": "List all analyzer logs, newest first.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {},
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  },
                  "ticker": {
                    "type": "string"
                  },
                  "stock_exchange": {
                    "type": "string"
                  },
                  "company_name": {
                    "type": "string"
                  },
                  "date": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "values": {
                    "type": "object",
                    "additionalProperties": {
                      "anyOf": [
                        {
                          "type": "number"
                        },
                        {
                          "type": "string"
                        }
                      ]
                    }
                  },
                  "scores": {
                    "type": "object",
                    "additionalProperties": {
                      "type": "number"
                    }
                  },
                  "quantitative": {
                    "type": "object",
                    "additionalProperties": {
                      "type": "boolean"
                    }
                  }
                },
                "required": [
                  "id",
                  "ticker",
                  "stock_exchange",
                  "company_name",
                  "date",
                  "values",
                  "scores",
                  "quantitative"
                ],
                "additionalProperties": false
              }
            }
          }
        },
        "remove": {
          "method": "post",
          "description": "Delete an analyzer log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "query": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              },
              "required": [
                "id"
              ],
              "additionalProperties": false
            }
          },
          "output": {
            "NO_CONTENT": true
          }
        },
        "update": {
          "method": "post",
          "description": "Update an analyzer log.",
          "noAuth": false,
          "encrypted": true,
          "isDownloadable": false,
          "media": null,
          "input": {
            "query": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                }
              },
              "required": [
                "id"
              ],
              "additionalProperties": false
            },
            "body": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "ticker": {
                  "type": "string"
                },
                "stock_exchange": {
                  "type": "string"
                },
                "company_name": {
                  "type": "string"
                },
                "date": {
                  "type": "string"
                },
                "values": {
                  "type": "object",
                  "additionalProperties": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "string"
                      }
                    ]
                  }
                },
                "scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "number"
                  }
                },
                "quantitative": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "boolean"
                  }
                }
              },
              "additionalProperties": false
            }
          },
          "output": {
            "OK": {
              "$schema": "https://json-schema.org/draft/2020-12/schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "ticker": {
                  "type": "string"
                },
                "stock_exchange": {
                  "type": "string"
                },
                "company_name": {
                  "type": "string"
                },
                "date": {
                  "type": "string",
                  "format": "date-time"
                },
                "values": {
                  "type": "object",
                  "additionalProperties": {
                    "anyOf": [
                      {
                        "type": "number"
                      },
                      {
                        "type": "string"
                      }
                    ]
                  }
                },
                "scores": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "number"
                  }
                },
                "quantitative": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "boolean"
                  }
                }
              },
              "required": [
                "id",
                "ticker",
                "stock_exchange",
                "company_name",
                "date",
                "values",
                "scores",
                "quantitative"
              ],
              "additionalProperties": false
            }
          }
        }
      }
    }
  }
} as const

export default contract
