import Result from "../models/resultModel.js";

export async function createResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { title, technology, level, totalQuestions, correct, wrong } =
      req.body;
    if (
      !technology ||
      !level ||
      totalQuestions === undefined ||
      correct === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }
    const computedWrong =
      wrong !== undefined
        ? Number(wrong)
        : Math.max(0, Number(totalQuestions) - Number(correct));

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing Title",
      });
    }

    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id,
    };

    const created = await Result.create(payload);
    return res.status(201).json({
      success: true,
      message: "Result Created",
      result: created,
    });
  } catch (err) {
    console.log(err);
    console.err("create Result Error", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// LISTING OF THE Result

export async function listResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const { technology } = req.query;
    const query = { user: req.user._id };
    if (technology && technology.toLowerCase() != "all") {
      query.technology = technology;
    }
    const items = await Result.find(query).sort({ createdAt: -1 }).lean();

    return res.json({
      success: true,
      results: items,
    });
  } catch (err) {
    console.log(err);
    console.err("Result Error", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
